// Admin user management (owner only).
// Invoked from the admin dashboard to create/update admin accounts.
//
//   curl -X POST https://<ref>.supabase.co/functions/v1/admin-users \
//     -H "Authorization: Bearer <user access token>" \
//     -H "Content-Type: application/json" \
//     -d '{"action":"create","email":"...","password":"...","role":"staff"}'

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { data: caller, error: callerError } = await supabase.auth.getUser(token);
  if (callerError || !caller.user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", caller.user.id)
    .single();

  if (!profile || profile.role !== "owner" || profile.is_active !== true) {
    return json({ error: "Owner access required" }, 403);
  }

  const { action } = await req.json();

  switch (action) {
    case "create":
      return createUser(await req.json());
    case "update-role":
      return updateRole(await req.json());
    case "update-status":
      return updateStatus(await req.json());
    case "delete":
      return deleteUser(await req.json());
    default:
      return json({ error: "Unknown action" }, 400);
  }
});

async function createUser({ email, password, role = "staff" }) {
  if (!email || !password) {
    return json({ error: "Email and password are required" }, 400);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return json({ error: error.message }, 400);

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    role,
  });

  if (profileError) return json({ error: profileError.message }, 400);

  return json({ user: { id: data.user.id, email, role } });
}

async function updateRole({ userId, role }) {
  if (!userId || !["owner", "staff"].includes(role)) {
    return json({ error: "Invalid user or role" }, 400);
  }
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return json({ error: error.message }, 400);
  return json({ success: true });
}

async function updateStatus({ userId, isActive }) {
  if (!userId || typeof isActive !== "boolean") {
    return json({ error: "Invalid user or status" }, 400);
  }
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);
  if (error) return json({ error: error.message }, 400);
  return json({ success: true });
}

async function deleteUser({ userId }) {
  if (!userId) return json({ error: "userId is required" }, 400);

  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (target?.role === "owner") {
    return json({ error: "Cannot delete an owner account" }, 400);
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return json({ error: error.message }, 400);

  await supabase.from("profiles").delete().eq("id", userId);
  return json({ success: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
