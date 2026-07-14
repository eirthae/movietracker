-- Multi-chain cinemas: AEON, TOHO Cinemas, Parks Cinema/SMT.
-- Adapter dispatch happens on `chain`; `slug` is the chain-local cinema code
-- (AEON 'utazu', TOHO '032', Parks 'namba'). Existing v2.0 rows are AEON.

alter table cinemas add column if not exists chain text not null default 'aeon';
alter table cinemas add column if not exists slug text;

update cinemas set slug = id where slug is null;

alter table cinemas alter column slug set not null;
