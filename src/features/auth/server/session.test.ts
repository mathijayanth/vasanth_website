import "@/test/setup-env";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { UserRole } from "@prisma/client";
import { signSessionToken } from "../session-token";
import { resolveSessionUser } from "./session";

type StoredUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  sessionVersion: number;
};

function createUserStore(user: StoredUser) {
  const stored = { ...user };
  return {
    stored,
    findUser: async (id: string) => (id === stored.id ? { ...stored } : null),
  };
}

const baseUser: StoredUser = {
  id: "user_1",
  email: "editor@example.com",
  role: "EDITOR",
  name: "Editor",
  sessionVersion: 0,
};

async function tokenFor(user: StoredUser) {
  const token = await signSessionToken(user);
  assert.ok(token);
  return token;
}

describe("resolveSessionUser", () => {
  it("accepts a token whose version matches the database, without exposing the version", async () => {
    const store = createUserStore(baseUser);
    const user = await resolveSessionUser(await tokenFor(store.stored), store.findUser);
    assert.deepEqual(user, {
      id: "user_1",
      email: "editor@example.com",
      role: "EDITOR",
      name: "Editor",
    });
  });

  it("rejects the old token after the version is incremented, accepts a newly issued one", async () => {
    const store = createUserStore(baseUser);
    const oldToken = await tokenFor(store.stored);

    store.stored.sessionVersion += 1;
    assert.equal(await resolveSessionUser(oldToken, store.findUser), null);

    const newToken = await tokenFor(store.stored);
    assert.ok(await resolveSessionUser(newToken, store.findUser));
  });

  it("rejects a token for a deleted user or a changed email", async () => {
    const token = await tokenFor(baseUser);
    assert.equal(await resolveSessionUser(token, async () => null), null);

    const store = createUserStore({ ...baseUser, email: "changed@example.com" });
    assert.equal(await resolveSessionUser(token, store.findUser), null);
  });

  it("uses the role from the database, not the token", async () => {
    const token = await tokenFor({ ...baseUser, role: "ADMIN" });
    const store = createUserStore(baseUser);
    const user = await resolveSessionUser(token, store.findUser);
    assert.equal(user?.role, "EDITOR");
  });

  it("does not authenticate when the database lookup fails", async () => {
    const token = await tokenFor(baseUser);
    await assert.rejects(
      resolveSessionUser(token, async () => {
        throw new Error("connection refused");
      }),
      /connection refused/,
    );
  });

  it("skips the database entirely for an invalid token", async () => {
    let lookups = 0;
    const user = await resolveSessionUser("garbage", async () => {
      lookups += 1;
      return baseUser;
    });
    assert.equal(user, null);
    assert.equal(lookups, 0);
  });
});
