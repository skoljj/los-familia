-- RPC to atomically increment a member's star balance
create or replace function increment_stars(member_uuid uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update family_members
  set star_balance = star_balance + amount
  where id = member_uuid;
end;
$$;
