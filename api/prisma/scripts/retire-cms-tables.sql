-- Retirement of the legacy Strapi tables and the landing template.
--
-- DESTRUCTIVE AND ONE-OFF: run by hand per database, NOT on deploy. It used to
-- live in `align-prod-schema.sql`, which runs on every build; there it was a
-- no-op as long as the tables didn't exist, but it left destructive DDL on the
-- deploy's critical path: if any of these tables ever came back (a future
-- migration, a backup restore), the next deploy would have dropped it without
-- warning.
--
--   Usage:  psql "$DATABASE_URL" -f prisma/scripts/retire-cms-tables.sql
--
-- Idempotent (IF EXISTS), so re-running it doesn't fail. Take a backup first.

-- Retire the legacy Strapi tables the API doesn't use (admin_* and strapi_*).
-- CASCADE also drops the created_by_id/updated_by_id FKs that pointed to
-- admin_users from the business tables (the columns are kept, without a
-- constraint; the API doesn't use them). Idempotent (IF EXISTS). See
-- schema.prisma (it no longer declares these models).
DROP TABLE IF EXISTS
  admin_permissions_role_lnk, admin_users_roles_lnk, admin_permissions,
  admin_roles, admin_users,
  strapi_api_token_permissions_token_lnk, strapi_api_token_permissions,
  strapi_api_tokens, strapi_core_store_settings, strapi_database_schema,
  strapi_history_versions, strapi_migrations, strapi_migrations_internal,
  strapi_release_actions_release_lnk, strapi_release_actions, strapi_releases,
  strapi_transfer_token_permissions_token_lnk, strapi_transfer_token_permissions,
  strapi_transfer_tokens, strapi_webhooks,
  strapi_workflows_stage_required_to_publish_lnk,
  strapi_workflows_stages_permissions_lnk, strapi_workflows_stages_workflow_lnk,
  strapi_workflows_stages, strapi_workflows
CASCADE;

-- Retire the Strapi landing-template components the app NEVER renders (the
-- content module only handles an allowlist of types and the front uses static
-- UI). Empty and unreferenced in code. Idempotent.
-- The components that ARE used are kept (shared.section, navbar, footer,
-- dynamic-zone.faq/how-it-works/story-panel/form-next-to-section, seo, form…).
DROP TABLE IF EXISTS
  components_cards_graph_cards_cmps, components_cards_graph_cards,
  components_cards_ray_cards_cmps, components_cards_ray_cards,
  components_cards_social_media_cards_logos_lnk, components_cards_social_media_cards,
  components_cards_globe_cards, components_calendar_events,
  components_dynamic_zone_brands_logos_lnk, components_dynamic_zone_brands,
  components_dynamic_zone_ctas_cmps, components_dynamic_zone_ctas,
  components_dynamic_zone_features_cmps, components_dynamic_zone_features,
  components_dynamic_zone_heroes_cmps, components_dynamic_zone_heroes,
  components_dynamic_zone_launches_cmps, components_dynamic_zone_launches,
  components_dynamic_zone_pricings,
  components_dynamic_zone_related_products_products_lnk, components_dynamic_zone_related_products,
  components_dynamic_zone_rich_texts_cmps, components_dynamic_zone_rich_texts,
  components_dynamic_zone_testimonials,
  components_items_graph_card_top_items, components_items_left_navbar_items,
  components_items_ray_items,
  components_shared_buttons, components_shared_launches, components_shared_perks,
  components_shared_rich_texts,
  components_shared_social_media_icon_links_cmps, components_shared_social_media_icon_links,
  components_shared_users
CASCADE;

-- Retire the legacy Strapi infrastructure the API doesn't use: the
-- product_pages content-type (no consumers), i18n_locale, log_products (audit),
-- the media folder library (upload_folders + links; files are served through
-- files_related_mph, not by folder) and the users-permissions permissions
-- (up_permissions; the staff guard goes by email, not by these permissions).
-- No incoming FKs from kept tables. Idempotent.
DROP TABLE IF EXISTS
  product_pages_cmps, product_pages,
  i18n_locale, log_products,
  files_folder_lnk, upload_folders_parent_lnk, upload_folders,
  up_permissions_role_lnk, up_permissions
CASCADE;

-- Retire navbar and SEO from the DB: the front uses a static navbar
-- (lib/constants/navbar) and static SEO (lib/seo-pages), and they were removed
-- from the API's content module. The footer is kept (it is rendered).
DROP TABLE IF EXISTS
  components_global_navbars_cmps, components_global_navbars_logo_lnk,
  components_global_navbars, components_shared_seos
CASCADE;

-- Retire ALL CMS content: the front now handles it statically (hardcoded
-- about/contact/faq/how-it-works/policy-privacy pages and footer). The API's
-- ContentController was removed. KEPT: faqs (editable in the backoffice, /faq
-- reads them from /api/faqs), social_networks(+_cmps) and
-- components_shared_links (social networks), and components_order_items (orders).
DROP TABLE IF EXISTS
  pages_cmps, pages, globals_cmps, globals,
  components_dynamic_zone_faqs_faqs_lnk, components_dynamic_zone_faqs,
  components_dynamic_zone_form_n2610e_social_networks_lnk,
  components_dynamic_zone_form_next_to_sections_cmps, components_dynamic_zone_form_next_to_sections,
  components_dynamic_zone_how_it_works_cmps, components_dynamic_zone_how_it_works,
  components_dynamic_zone_story_panels_cmps, components_dynamic_zone_story_panels,
  components_global_footers_cmps, components_global_footers_logo_lnk,
  components_global_footers_social_networks_lnk, components_global_footers,
  components_items_inputs,
  components_shared_forms_cmps, components_shared_forms,
  components_shared_sections_cmps, components_shared_sections,
  components_shared_steps, components_shared_story_panel_shareds
CASCADE;
