-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "full_name" VARCHAR(255),
    "phone" VARCHAR(255),
    "line_1" VARCHAR(255),
    "line_2" VARCHAR(255),
    "city" VARCHAR(255),
    "department" VARCHAR(255),
    "notes" TEXT,
    "is_default" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),
    "ci" VARCHAR(255),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses_user_lnk" (
    "id" SERIAL NOT NULL,
    "address_id" INTEGER,
    "user_id" INTEGER,
    "address_ord" DOUBLE PRECISION,

    CONSTRAINT "addresses_user_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "action" VARCHAR(255),
    "action_parameters" JSONB,
    "subject" VARCHAR(255),
    "properties" JSONB,
    "conditions" JSONB,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions_role_lnk" (
    "id" SERIAL NOT NULL,
    "permission_id" INTEGER,
    "role_id" INTEGER,
    "permission_ord" DOUBLE PRECISION,

    CONSTRAINT "admin_permissions_role_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "username" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "reset_password_token" VARCHAR(255),
    "registration_token" VARCHAR(255),
    "is_active" BOOLEAN,
    "blocked" BOOLEAN,
    "prefered_language" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users_roles_lnk" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "role_id" INTEGER,
    "role_ord" DOUBLE PRECISION,
    "user_ord" DOUBLE PRECISION,

    CONSTRAINT "admin_users_roles_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_calendar_events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "date" DATE,
    "start" TIME(6),
    "end" TIME(6),
    "repeats" VARCHAR(255),
    "recurring_days" JSONB,
    "ends_at" DATE,

    CONSTRAINT "components_calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_globe_cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "span" VARCHAR(255),

    CONSTRAINT "components_cards_globe_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_graph_cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "highlighted_text" VARCHAR(255),
    "span" VARCHAR(255),

    CONSTRAINT "components_cards_graph_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_graph_cards_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_cards_graph_cards_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_ray_cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "span" VARCHAR(255),

    CONSTRAINT "components_cards_ray_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_ray_cards_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_cards_ray_cards_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_social_media_cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "span" VARCHAR(255),

    CONSTRAINT "components_cards_social_media_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_cards_social_media_cards_logos_lnk" (
    "id" SERIAL NOT NULL,
    "social_media_card_id" INTEGER,
    "logo_id" INTEGER,
    "logo_ord" DOUBLE PRECISION,

    CONSTRAINT "components_cards_social_media_cards_logos_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_brands" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_brands_logos_lnk" (
    "id" SERIAL NOT NULL,
    "brands_id" INTEGER,
    "logo_id" INTEGER,
    "logo_ord" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_brands_logos_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_ctas" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_ctas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_ctas_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_ctas_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_faqs" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_faqs_faqs_lnk" (
    "id" SERIAL NOT NULL,
    "faq_id" INTEGER,
    "inv_faq_id" INTEGER,
    "faq_ord" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_faqs_faqs_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_features" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_features_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_features_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_form_n2610e_social_networks_lnk" (
    "id" SERIAL NOT NULL,
    "form_next_to_section_id" INTEGER,
    "social_network_id" INTEGER,
    "social_network_ord" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_form_n2610e_social_networks_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_form_next_to_sections" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_form_next_to_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_form_next_to_sections_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_form_next_to_sections_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_heroes" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" TEXT,

    CONSTRAINT "components_dynamic_zone_heroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_heroes_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_heroes_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_how_it_works" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_how_it_works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_how_it_works_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_how_it_works_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_launches" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_launches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_launches_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_launches_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_pricings" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),
    "plans" JSONB,

    CONSTRAINT "components_dynamic_zone_pricings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_related_products" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_related_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_related_products_products_lnk" (
    "id" SERIAL NOT NULL,
    "related_products_id" INTEGER,
    "product_id" INTEGER,
    "product_ord" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_related_products_products_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_rich_texts" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_dynamic_zone_rich_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_rich_texts_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_rich_texts_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_story_panels" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_dynamic_zone_story_panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_story_panels_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_dynamic_zone_story_panels_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_dynamic_zone_testimonials" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_dynamic_zone_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_footers" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "copyright" VARCHAR(255),
    "designed_developed_by" VARCHAR(255),
    "built_with" VARCHAR(255),

    CONSTRAINT "components_global_footers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_footers_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_global_footers_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_footers_logo_lnk" (
    "id" SERIAL NOT NULL,
    "footer_id" INTEGER,
    "logo_id" INTEGER,

    CONSTRAINT "components_global_footers_logo_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_footers_social_networks_lnk" (
    "id" SERIAL NOT NULL,
    "footer_id" INTEGER,
    "social_network_id" INTEGER,
    "social_network_ord" DOUBLE PRECISION,

    CONSTRAINT "components_global_footers_social_networks_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_navbars" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_global_navbars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_navbars_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_global_navbars_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_global_navbars_logo_lnk" (
    "id" SERIAL NOT NULL,
    "navbar_id" INTEGER,
    "logo_id" INTEGER,

    CONSTRAINT "components_global_navbars_logo_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_items_graph_card_top_items" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(255),
    "text" VARCHAR(255),

    CONSTRAINT "components_items_graph_card_top_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_items_inputs" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255),
    "name" VARCHAR(255),
    "placeholder" VARCHAR(255),
    "label" VARCHAR(255),
    "required" BOOLEAN,

    CONSTRAINT "components_items_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_items_left_navbar_items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "url" VARCHAR(255),

    CONSTRAINT "components_items_left_navbar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_items_ray_items" (
    "id" SERIAL NOT NULL,
    "item_1" VARCHAR(255),
    "item_2" VARCHAR(255),
    "item_3" VARCHAR(255),

    CONSTRAINT "components_items_ray_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_order_items" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "name" VARCHAR(255),
    "slug" VARCHAR(255),
    "price" DECIMAL(10,2),
    "quantity" INTEGER,
    "image_url" VARCHAR(255),

    CONSTRAINT "components_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_buttons" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255),
    "url" VARCHAR(255),
    "target" VARCHAR(255),
    "variant" VARCHAR(255),

    CONSTRAINT "components_shared_buttons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_forms" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_shared_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_forms_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_shared_forms_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_launches" (
    "id" SERIAL NOT NULL,
    "mission_number" VARCHAR(255),
    "title" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "components_shared_launches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_links" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255),
    "url" VARCHAR(255),
    "target" VARCHAR(255),

    CONSTRAINT "components_shared_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_perks" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255),

    CONSTRAINT "components_shared_perks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_rich_texts" (
    "id" SERIAL NOT NULL,
    "tittle" VARCHAR(255),
    "description" JSONB,

    CONSTRAINT "components_shared_rich_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_sections" (
    "id" SERIAL NOT NULL,
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),

    CONSTRAINT "components_shared_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_sections_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_shared_sections_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_seos" (
    "id" SERIAL NOT NULL,
    "meta_title" VARCHAR(255),
    "meta_description" VARCHAR(255),
    "keywords" TEXT,
    "meta_robots" VARCHAR(255),
    "structured_data" JSONB,
    "meta_viewport" VARCHAR(255),
    "canonical_url" VARCHAR(255),

    CONSTRAINT "components_shared_seos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_social_media_icon_links" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_shared_social_media_icon_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_social_media_icon_links_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "components_shared_social_media_icon_links_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_steps" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),

    CONSTRAINT "components_shared_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_story_panel_shareds" (
    "id" SERIAL NOT NULL,
    "tittle" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "components_shared_story_panel_shareds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_shared_users" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "components_shared_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "question" TEXT,
    "answer" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "alternative_text" VARCHAR(255),
    "caption" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "formats" JSONB,
    "hash" VARCHAR(255),
    "ext" VARCHAR(255),
    "mime" VARCHAR(255),
    "size" DECIMAL(10,2),
    "url" VARCHAR(255),
    "preview_url" VARCHAR(255),
    "provider" VARCHAR(255),
    "provider_metadata" JSONB,
    "folder_path" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files_folder_lnk" (
    "id" SERIAL NOT NULL,
    "file_id" INTEGER,
    "folder_id" INTEGER,
    "file_ord" DOUBLE PRECISION,

    CONSTRAINT "files_folder_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files_related_mph" (
    "id" SERIAL NOT NULL,
    "file_id" INTEGER,
    "related_id" INTEGER,
    "related_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "files_related_mph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "globals" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "globals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "globals_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "globals_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "i18n_locale" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "i18n_locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_products" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "time" VARCHAR(255),
    "product" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "log_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logos" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "company" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "time" VARCHAR(255),
    "product" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "order_number" VARCHAR(255),
    "delivery_method" VARCHAR(255),
    "subtotal" DECIMAL(10,2),
    "shipping_cost" DECIMAL(10,2),
    "total" DECIMAL(10,2),
    "payment_method" VARCHAR(255),
    "status" VARCHAR(255),
    "customer_notes" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),
    "payment_reference" VARCHAR(255),
    "cancellation_reason" TEXT,
    "dest_lat" DECIMAL(10,2),
    "dest_lng" DECIMAL(10,2),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "orders_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_shipping_address_lnk" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "address_id" INTEGER,

    CONSTRAINT "orders_shipping_address_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_user_lnk" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "user_id" INTEGER,
    "order_ord" DOUBLE PRECISION,

    CONSTRAINT "orders_user_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_visits" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "path" VARCHAR(255),
    "referrer" VARCHAR(255),
    "session_id" VARCHAR(255),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "slug" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "pages_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_infos" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "bank_name" VARCHAR(255),
    "account_number" VARCHAR(255),
    "account_name" VARCHAR(255),
    "account_type" VARCHAR(255),
    "ci" VARCHAR(255),
    "instructions" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "payment_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_settings" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "markup_percent" DECIMAL(10,2),
    "province_shipping_cost" DECIMAL(10,2),
    "sc_center_lat" DECIMAL(10,2),
    "sc_center_lng" DECIMAL(10,2),
    "sc_radius_km" DECIMAL(10,2),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "pricing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_pages" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "heading" VARCHAR(255),
    "sub_heading" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "product_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_pages_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "product_pages_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "price" INTEGER,
    "slug" VARCHAR(255),
    "currency" VARCHAR(255),
    "description" TEXT,
    "visible" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_categories_lnk" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "category_id" INTEGER,

    CONSTRAINT "products_categories_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_networks" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "alias" VARCHAR(255),
    "name" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "social_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_networks_cmps" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER,
    "cmp_id" INTEGER,
    "component_type" VARCHAR(255),
    "field" VARCHAR(255),
    "order" DOUBLE PRECISION,

    CONSTRAINT "social_networks_cmps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_events" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "type" VARCHAR(255),
    "label" VARCHAR(255),
    "product_slug" VARCHAR(255),
    "quantity" INTEGER,
    "path" VARCHAR(255),
    "session_id" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "store_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_api_token_permissions" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "action" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_api_token_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_api_token_permissions_token_lnk" (
    "id" SERIAL NOT NULL,
    "api_token_permission_id" INTEGER,
    "api_token_id" INTEGER,
    "api_token_permission_ord" DOUBLE PRECISION,

    CONSTRAINT "strapi_api_token_permissions_token_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_api_tokens" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "type" VARCHAR(255),
    "access_key" VARCHAR(255),
    "encrypted_key" TEXT,
    "last_used_at" TIMESTAMP(6),
    "expires_at" TIMESTAMP(6),
    "lifespan" BIGINT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_api_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_core_store_settings" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255),
    "value" TEXT,
    "type" VARCHAR(255),
    "environment" VARCHAR(255),
    "tag" VARCHAR(255),

    CONSTRAINT "strapi_core_store_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_database_schema" (
    "id" SERIAL NOT NULL,
    "schema" JSON,
    "time" TIMESTAMP(6),
    "hash" VARCHAR(255),

    CONSTRAINT "strapi_database_schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_history_versions" (
    "id" SERIAL NOT NULL,
    "content_type" VARCHAR(255) NOT NULL,
    "related_document_id" VARCHAR(255),
    "locale" VARCHAR(255),
    "status" VARCHAR(255),
    "data" JSONB,
    "schema" JSONB,
    "created_at" TIMESTAMP(6),
    "created_by_id" INTEGER,

    CONSTRAINT "strapi_history_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "time" TIMESTAMP(6),

    CONSTRAINT "strapi_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_migrations_internal" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "time" TIMESTAMP(6),

    CONSTRAINT "strapi_migrations_internal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_release_actions" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "type" VARCHAR(255),
    "content_type" VARCHAR(255),
    "entry_document_id" VARCHAR(255),
    "locale" VARCHAR(255),
    "is_entry_valid" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,

    CONSTRAINT "strapi_release_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_release_actions_release_lnk" (
    "id" SERIAL NOT NULL,
    "release_action_id" INTEGER,
    "release_id" INTEGER,
    "release_action_ord" DOUBLE PRECISION,

    CONSTRAINT "strapi_release_actions_release_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_releases" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "released_at" TIMESTAMP(6),
    "scheduled_at" TIMESTAMP(6),
    "timezone" VARCHAR(255),
    "status" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_transfer_token_permissions" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "action" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_transfer_token_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_transfer_token_permissions_token_lnk" (
    "id" SERIAL NOT NULL,
    "transfer_token_permission_id" INTEGER,
    "transfer_token_id" INTEGER,
    "transfer_token_permission_ord" DOUBLE PRECISION,

    CONSTRAINT "strapi_transfer_token_permissions_token_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_transfer_tokens" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "access_key" VARCHAR(255),
    "last_used_at" TIMESTAMP(6),
    "expires_at" TIMESTAMP(6),
    "lifespan" BIGINT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_transfer_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_webhooks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "url" TEXT,
    "headers" JSONB,
    "events" JSONB,
    "enabled" BOOLEAN,

    CONSTRAINT "strapi_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_workflows" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "content_types" JSONB,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_workflows_stage_required_to_publish_lnk" (
    "id" SERIAL NOT NULL,
    "workflow_id" INTEGER,
    "workflow_stage_id" INTEGER,

    CONSTRAINT "strapi_workflows_stage_required_to_publish_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_workflows_stages" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "color" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "strapi_workflows_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_workflows_stages_permissions_lnk" (
    "id" SERIAL NOT NULL,
    "workflow_stage_id" INTEGER,
    "permission_id" INTEGER,
    "permission_ord" DOUBLE PRECISION,

    CONSTRAINT "strapi_workflows_stages_permissions_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_workflows_stages_workflow_lnk" (
    "id" SERIAL NOT NULL,
    "workflow_stage_id" INTEGER,
    "workflow_id" INTEGER,
    "workflow_stage_ord" DOUBLE PRECISION,

    CONSTRAINT "strapi_workflows_stages_workflow_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_permissions" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "action" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "up_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_permissions_role_lnk" (
    "id" SERIAL NOT NULL,
    "permission_id" INTEGER,
    "role_id" INTEGER,
    "permission_ord" DOUBLE PRECISION,

    CONSTRAINT "up_permissions_role_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_roles" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "type" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "up_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_users" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "username" VARCHAR(255),
    "email" VARCHAR(255),
    "provider" VARCHAR(255),
    "password" VARCHAR(255),
    "reset_password_token" VARCHAR(255),
    "confirmation_token" VARCHAR(255),
    "confirmed" BOOLEAN,
    "blocked" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "phone" VARCHAR(255),

    CONSTRAINT "up_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_users_role_lnk" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "role_id" INTEGER,
    "user_ord" DOUBLE PRECISION,

    CONSTRAINT "up_users_role_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_folders" (
    "id" SERIAL NOT NULL,
    "document_id" VARCHAR(255),
    "name" VARCHAR(255),
    "path_id" INTEGER,
    "path" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "locale" VARCHAR(255),

    CONSTRAINT "upload_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_folders_parent_lnk" (
    "id" SERIAL NOT NULL,
    "folder_id" INTEGER,
    "inv_folder_id" INTEGER,
    "folder_ord" DOUBLE PRECISION,

    CONSTRAINT "upload_folders_parent_lnk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "addresses_created_by_id_fk_idx" ON "addresses"("created_by_id");

-- CreateIndex
CREATE INDEX "addresses_documents_idx" ON "addresses"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "addresses_updated_by_id_fk_idx" ON "addresses"("updated_by_id");

-- CreateIndex
CREATE INDEX "addresses_user_lnk_fk_idx" ON "addresses_user_lnk"("address_id");

-- CreateIndex
CREATE INDEX "addresses_user_lnk_ifk_idx" ON "addresses_user_lnk"("user_id");

-- CreateIndex
CREATE INDEX "addresses_user_lnk_oifk" ON "addresses_user_lnk"("address_ord");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_user_lnk_uq" ON "addresses_user_lnk"("address_id", "user_id");

-- CreateIndex
CREATE INDEX "admin_permissions_created_by_id_fk_idx" ON "admin_permissions"("created_by_id");

-- CreateIndex
CREATE INDEX "admin_permissions_document_id_idx" ON "admin_permissions"("document_id");

-- CreateIndex
CREATE INDEX "admin_permissions_document_id_locale_published_at_idx" ON "admin_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_permissions_documents_idx" ON "admin_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_permissions_updated_by_id_fk_idx" ON "admin_permissions"("updated_by_id");

-- CreateIndex
CREATE INDEX "admin_permissions_role_lnk_fk_idx" ON "admin_permissions_role_lnk"("permission_id");

-- CreateIndex
CREATE INDEX "admin_permissions_role_lnk_ifk_idx" ON "admin_permissions_role_lnk"("role_id");

-- CreateIndex
CREATE INDEX "admin_permissions_role_lnk_oifk" ON "admin_permissions_role_lnk"("permission_ord");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_role_lnk_uq" ON "admin_permissions_role_lnk"("permission_id", "role_id");

-- CreateIndex
CREATE INDEX "admin_roles_created_by_id_fk_idx" ON "admin_roles"("created_by_id");

-- CreateIndex
CREATE INDEX "admin_roles_document_id_idx" ON "admin_roles"("document_id");

-- CreateIndex
CREATE INDEX "admin_roles_document_id_locale_published_at_idx" ON "admin_roles"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_roles_documents_idx" ON "admin_roles"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_roles_updated_by_id_fk_idx" ON "admin_roles"("updated_by_id");

-- CreateIndex
CREATE INDEX "admin_users_created_by_id_fk_idx" ON "admin_users"("created_by_id");

-- CreateIndex
CREATE INDEX "admin_users_document_id_idx" ON "admin_users"("document_id");

-- CreateIndex
CREATE INDEX "admin_users_document_id_locale_published_at_idx" ON "admin_users"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_users_documents_idx" ON "admin_users"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "admin_users_updated_by_id_fk_idx" ON "admin_users"("updated_by_id");

-- CreateIndex
CREATE INDEX "admin_users_roles_lnk_fk_idx" ON "admin_users_roles_lnk"("user_id");

-- CreateIndex
CREATE INDEX "admin_users_roles_lnk_ifk_idx" ON "admin_users_roles_lnk"("role_id");

-- CreateIndex
CREATE INDEX "admin_users_roles_lnk_ofk" ON "admin_users_roles_lnk"("role_ord");

-- CreateIndex
CREATE INDEX "admin_users_roles_lnk_oifk" ON "admin_users_roles_lnk"("user_ord");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_roles_lnk_uq" ON "admin_users_roles_lnk"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "categories_created_by_id_fk_idx" ON "categories"("created_by_id");

-- CreateIndex
CREATE INDEX "categories_document_id_idx" ON "categories"("document_id");

-- CreateIndex
CREATE INDEX "categories_document_id_locale_published_at_idx" ON "categories"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "categories_documents_idx" ON "categories"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "categories_updated_by_id_fk_idx" ON "categories"("updated_by_id");

-- CreateIndex
CREATE INDEX "components_cards_graph_cards_component_type_idx" ON "components_cards_graph_cards_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_cards_graph_cards_entity_fk_idx" ON "components_cards_graph_cards_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_cards_graph_cards_field_idx" ON "components_cards_graph_cards_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_cards_graph_cards_uq" ON "components_cards_graph_cards_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_cards_ray_cards_component_type_idx" ON "components_cards_ray_cards_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_cards_ray_cards_entity_fk_idx" ON "components_cards_ray_cards_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_cards_ray_cards_field_idx" ON "components_cards_ray_cards_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_cards_ray_cards_uq" ON "components_cards_ray_cards_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_cards_social_media_cards_logos_lnk_fk_idx" ON "components_cards_social_media_cards_logos_lnk"("social_media_card_id");

-- CreateIndex
CREATE INDEX "components_cards_social_media_cards_logos_lnk_ifk_idx" ON "components_cards_social_media_cards_logos_lnk"("logo_id");

-- CreateIndex
CREATE INDEX "components_cards_social_media_cards_logos_lnk_ofk" ON "components_cards_social_media_cards_logos_lnk"("logo_ord");

-- CreateIndex
CREATE UNIQUE INDEX "components_cards_social_media_cards_logos_lnk_uq" ON "components_cards_social_media_cards_logos_lnk"("social_media_card_id", "logo_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_brands_logos_lnk_fk_idx" ON "components_dynamic_zone_brands_logos_lnk"("brands_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_brands_logos_lnk_ifk_idx" ON "components_dynamic_zone_brands_logos_lnk"("logo_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_brands_logos_lnk_ofk" ON "components_dynamic_zone_brands_logos_lnk"("logo_ord");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_brands_logos_lnk_uq" ON "components_dynamic_zone_brands_logos_lnk"("brands_id", "logo_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_ctas_component_type_idx" ON "components_dynamic_zone_ctas_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_ctas_entity_fk_idx" ON "components_dynamic_zone_ctas_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_ctas_field_idx" ON "components_dynamic_zone_ctas_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_ctas_uq" ON "components_dynamic_zone_ctas_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_faqs_faqs_lnk_fk_idx" ON "components_dynamic_zone_faqs_faqs_lnk"("faq_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_faqs_faqs_lnk_ifk_idx" ON "components_dynamic_zone_faqs_faqs_lnk"("inv_faq_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_faqs_faqs_lnk_ofk" ON "components_dynamic_zone_faqs_faqs_lnk"("faq_ord");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_faqs_faqs_lnk_uq" ON "components_dynamic_zone_faqs_faqs_lnk"("faq_id", "inv_faq_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_features_component_type_idx" ON "components_dynamic_zone_features_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_features_entity_fk_idx" ON "components_dynamic_zone_features_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_features_field_idx" ON "components_dynamic_zone_features_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_features_uq" ON "components_dynamic_zone_features_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_n2610e_social_net2db5f_ifk_idx" ON "components_dynamic_zone_form_n2610e_social_networks_lnk"("social_network_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_n2610e_social_net2db5f_ofk" ON "components_dynamic_zone_form_n2610e_social_networks_lnk"("social_network_ord");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_n2610e_social_netw2db5f_fk_idx" ON "components_dynamic_zone_form_n2610e_social_networks_lnk"("form_next_to_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_form_n2610e_social_netw2db5f_uq" ON "components_dynamic_zone_form_n2610e_social_networks_lnk"("form_next_to_section_id", "social_network_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_ne2610e_component_type_idx" ON "components_dynamic_zone_form_next_to_sections_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_next_to_sections_entity_fk_idx" ON "components_dynamic_zone_form_next_to_sections_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_form_next_to_sections_field_idx" ON "components_dynamic_zone_form_next_to_sections_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_form_next_to_sections_uq" ON "components_dynamic_zone_form_next_to_sections_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_heroes_component_type_idx" ON "components_dynamic_zone_heroes_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_heroes_entity_fk_idx" ON "components_dynamic_zone_heroes_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_heroes_field_idx" ON "components_dynamic_zone_heroes_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_heroes_uq" ON "components_dynamic_zone_heroes_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_how_it_works_component_type_idx" ON "components_dynamic_zone_how_it_works_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_how_it_works_entity_fk_idx" ON "components_dynamic_zone_how_it_works_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_how_it_works_field_idx" ON "components_dynamic_zone_how_it_works_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_how_it_works_uq" ON "components_dynamic_zone_how_it_works_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_launches_component_type_idx" ON "components_dynamic_zone_launches_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_launches_entity_fk_idx" ON "components_dynamic_zone_launches_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_launches_field_idx" ON "components_dynamic_zone_launches_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_launches_uq" ON "components_dynamic_zone_launches_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_related_products_produ898a7_ifk_idx" ON "components_dynamic_zone_related_products_products_lnk"("product_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_related_products_produ898a7_ofk" ON "components_dynamic_zone_related_products_products_lnk"("product_ord");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_related_products_produc898a7_fk_idx" ON "components_dynamic_zone_related_products_products_lnk"("related_products_id");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_related_products_produc898a7_uq" ON "components_dynamic_zone_related_products_products_lnk"("related_products_id", "product_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_rich_texts_component_type_idx" ON "components_dynamic_zone_rich_texts_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_rich_texts_entity_fk_idx" ON "components_dynamic_zone_rich_texts_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_rich_texts_field_idx" ON "components_dynamic_zone_rich_texts_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_rich_texts_uq" ON "components_dynamic_zone_rich_texts_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_story_panels_component_type_idx" ON "components_dynamic_zone_story_panels_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_story_panels_entity_fk_idx" ON "components_dynamic_zone_story_panels_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_dynamic_zone_story_panels_field_idx" ON "components_dynamic_zone_story_panels_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_dynamic_zone_story_panels_uq" ON "components_dynamic_zone_story_panels_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_global_footers_component_type_idx" ON "components_global_footers_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_global_footers_entity_fk_idx" ON "components_global_footers_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_global_footers_field_idx" ON "components_global_footers_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_global_footers_uq" ON "components_global_footers_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_global_footers_logo_lnk_fk_idx" ON "components_global_footers_logo_lnk"("footer_id");

-- CreateIndex
CREATE INDEX "components_global_footers_logo_lnk_ifk_idx" ON "components_global_footers_logo_lnk"("logo_id");

-- CreateIndex
CREATE UNIQUE INDEX "components_global_footers_logo_lnk_uq" ON "components_global_footers_logo_lnk"("footer_id", "logo_id");

-- CreateIndex
CREATE INDEX "components_global_footers_social_networks_lnk_fk_idx" ON "components_global_footers_social_networks_lnk"("footer_id");

-- CreateIndex
CREATE INDEX "components_global_footers_social_networks_lnk_ifk_idx" ON "components_global_footers_social_networks_lnk"("social_network_id");

-- CreateIndex
CREATE INDEX "components_global_footers_social_networks_lnk_ofk" ON "components_global_footers_social_networks_lnk"("social_network_ord");

-- CreateIndex
CREATE UNIQUE INDEX "components_global_footers_social_networks_lnk_uq" ON "components_global_footers_social_networks_lnk"("footer_id", "social_network_id");

-- CreateIndex
CREATE INDEX "components_global_navbars_component_type_idx" ON "components_global_navbars_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_global_navbars_entity_fk_idx" ON "components_global_navbars_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_global_navbars_field_idx" ON "components_global_navbars_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_global_navbars_uq" ON "components_global_navbars_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_global_navbars_logo_lnk_fk_idx" ON "components_global_navbars_logo_lnk"("navbar_id");

-- CreateIndex
CREATE INDEX "components_global_navbars_logo_lnk_ifk_idx" ON "components_global_navbars_logo_lnk"("logo_id");

-- CreateIndex
CREATE UNIQUE INDEX "components_global_navbars_logo_lnk_uq" ON "components_global_navbars_logo_lnk"("navbar_id", "logo_id");

-- CreateIndex
CREATE INDEX "components_shared_forms_component_type_idx" ON "components_shared_forms_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_shared_forms_entity_fk_idx" ON "components_shared_forms_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_shared_forms_field_idx" ON "components_shared_forms_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_shared_forms_uq" ON "components_shared_forms_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_shared_sections_component_type_idx" ON "components_shared_sections_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_shared_sections_entity_fk_idx" ON "components_shared_sections_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_shared_sections_field_idx" ON "components_shared_sections_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_shared_sections_uq" ON "components_shared_sections_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "components_shared_social_media_84fb0_component_type_idx" ON "components_shared_social_media_icon_links_cmps"("component_type");

-- CreateIndex
CREATE INDEX "components_shared_social_media_icon_links_entity_fk_idx" ON "components_shared_social_media_icon_links_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "components_shared_social_media_icon_links_field_idx" ON "components_shared_social_media_icon_links_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "components_shared_social_media_icon_links_uq" ON "components_shared_social_media_icon_links_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "faqs_created_by_id_fk_idx" ON "faqs"("created_by_id");

-- CreateIndex
CREATE INDEX "faqs_document_id_idx" ON "faqs"("document_id");

-- CreateIndex
CREATE INDEX "faqs_document_id_locale_published_at_idx" ON "faqs"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "faqs_documents_idx" ON "faqs"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "faqs_updated_by_id_fk_idx" ON "faqs"("updated_by_id");

-- CreateIndex
CREATE INDEX "files_created_by_id_fk_idx" ON "files"("created_by_id");

-- CreateIndex
CREATE INDEX "files_document_id_idx" ON "files"("document_id");

-- CreateIndex
CREATE INDEX "files_document_id_locale_published_at_idx" ON "files"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "files_documents_idx" ON "files"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "files_updated_by_id_fk_idx" ON "files"("updated_by_id");

-- CreateIndex
CREATE INDEX "upload_files_created_at_index" ON "files"("created_at");

-- CreateIndex
CREATE INDEX "upload_files_ext_index" ON "files"("ext");

-- CreateIndex
CREATE INDEX "upload_files_folder_path_index" ON "files"("folder_path");

-- CreateIndex
CREATE INDEX "upload_files_name_index" ON "files"("name");

-- CreateIndex
CREATE INDEX "upload_files_size_index" ON "files"("size");

-- CreateIndex
CREATE INDEX "upload_files_updated_at_index" ON "files"("updated_at");

-- CreateIndex
CREATE INDEX "files_folder_lnk_fk_idx" ON "files_folder_lnk"("file_id");

-- CreateIndex
CREATE INDEX "files_folder_lnk_ifk_idx" ON "files_folder_lnk"("folder_id");

-- CreateIndex
CREATE INDEX "files_folder_lnk_oifk" ON "files_folder_lnk"("file_ord");

-- CreateIndex
CREATE UNIQUE INDEX "files_folder_lnk_uq" ON "files_folder_lnk"("file_id", "folder_id");

-- CreateIndex
CREATE INDEX "files_related_mph_fk_idx" ON "files_related_mph"("file_id");

-- CreateIndex
CREATE INDEX "files_related_mph_idix" ON "files_related_mph"("related_id");

-- CreateIndex
CREATE INDEX "files_related_mph_oidx" ON "files_related_mph"("order");

-- CreateIndex
CREATE INDEX "globals_created_by_id_fk_idx" ON "globals"("created_by_id");

-- CreateIndex
CREATE INDEX "globals_document_id_idx" ON "globals"("document_id");

-- CreateIndex
CREATE INDEX "globals_document_id_locale_published_at_idx" ON "globals"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "globals_documents_idx" ON "globals"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "globals_updated_by_id_fk_idx" ON "globals"("updated_by_id");

-- CreateIndex
CREATE INDEX "globals_component_type_idx" ON "globals_cmps"("component_type");

-- CreateIndex
CREATE INDEX "globals_entity_fk_idx" ON "globals_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "globals_field_idx" ON "globals_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "globals_uq" ON "globals_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "i18n_locale_created_by_id_fk_idx" ON "i18n_locale"("created_by_id");

-- CreateIndex
CREATE INDEX "i18n_locale_document_id_idx" ON "i18n_locale"("document_id");

-- CreateIndex
CREATE INDEX "i18n_locale_document_id_locale_published_at_idx" ON "i18n_locale"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "i18n_locale_documents_idx" ON "i18n_locale"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "i18n_locale_updated_by_id_fk_idx" ON "i18n_locale"("updated_by_id");

-- CreateIndex
CREATE INDEX "log_products_created_by_id_fk_idx" ON "log_products"("created_by_id");

-- CreateIndex
CREATE INDEX "log_products_documents_idx" ON "log_products"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "log_products_updated_by_id_fk_idx" ON "log_products"("updated_by_id");

-- CreateIndex
CREATE INDEX "logos_created_by_id_fk_idx" ON "logos"("created_by_id");

-- CreateIndex
CREATE INDEX "logos_documents_idx" ON "logos"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "logos_updated_by_id_fk_idx" ON "logos"("updated_by_id");

-- CreateIndex
CREATE INDEX "logs_created_by_id_fk_idx" ON "logs"("created_by_id");

-- CreateIndex
CREATE INDEX "logs_documents_idx" ON "logs"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "logs_updated_by_id_fk_idx" ON "logs"("updated_by_id");

-- CreateIndex
CREATE INDEX "orders_created_by_id_fk_idx" ON "orders"("created_by_id");

-- CreateIndex
CREATE INDEX "orders_documents_idx" ON "orders"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "orders_updated_by_id_fk_idx" ON "orders"("updated_by_id");

-- CreateIndex
CREATE INDEX "orders_component_type_idx" ON "orders_cmps"("component_type");

-- CreateIndex
CREATE INDEX "orders_entity_fk_idx" ON "orders_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "orders_field_idx" ON "orders_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "orders_uq" ON "orders_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "orders_shipping_address_lnk_fk_idx" ON "orders_shipping_address_lnk"("order_id");

-- CreateIndex
CREATE INDEX "orders_shipping_address_lnk_ifk_idx" ON "orders_shipping_address_lnk"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_shipping_address_lnk_uq" ON "orders_shipping_address_lnk"("order_id", "address_id");

-- CreateIndex
CREATE INDEX "orders_user_lnk_fk_idx" ON "orders_user_lnk"("order_id");

-- CreateIndex
CREATE INDEX "orders_user_lnk_ifk_idx" ON "orders_user_lnk"("user_id");

-- CreateIndex
CREATE INDEX "orders_user_lnk_oifk" ON "orders_user_lnk"("order_ord");

-- CreateIndex
CREATE UNIQUE INDEX "orders_user_lnk_uq" ON "orders_user_lnk"("order_id", "user_id");

-- CreateIndex
CREATE INDEX "page_visits_created_by_id_fk_idx" ON "page_visits"("created_by_id");

-- CreateIndex
CREATE INDEX "page_visits_documents_idx" ON "page_visits"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "page_visits_updated_by_id_fk_idx" ON "page_visits"("updated_by_id");

-- CreateIndex
CREATE INDEX "pages_created_by_id_fk_idx" ON "pages"("created_by_id");

-- CreateIndex
CREATE INDEX "pages_document_id_idx" ON "pages"("document_id");

-- CreateIndex
CREATE INDEX "pages_document_id_locale_published_at_idx" ON "pages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "pages_documents_idx" ON "pages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "pages_updated_by_id_fk_idx" ON "pages"("updated_by_id");

-- CreateIndex
CREATE INDEX "pages_component_type_idx" ON "pages_cmps"("component_type");

-- CreateIndex
CREATE INDEX "pages_entity_fk_idx" ON "pages_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "pages_field_idx" ON "pages_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "pages_uq" ON "pages_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "payment_infos_created_by_id_fk_idx" ON "payment_infos"("created_by_id");

-- CreateIndex
CREATE INDEX "payment_infos_documents_idx" ON "payment_infos"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "payment_infos_updated_by_id_fk_idx" ON "payment_infos"("updated_by_id");

-- CreateIndex
CREATE INDEX "pricing_settings_created_by_id_fk_idx" ON "pricing_settings"("created_by_id");

-- CreateIndex
CREATE INDEX "pricing_settings_documents_idx" ON "pricing_settings"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "pricing_settings_updated_by_id_fk_idx" ON "pricing_settings"("updated_by_id");

-- CreateIndex
CREATE INDEX "product_pages_created_by_id_fk_idx" ON "product_pages"("created_by_id");

-- CreateIndex
CREATE INDEX "product_pages_document_id_idx" ON "product_pages"("document_id");

-- CreateIndex
CREATE INDEX "product_pages_document_id_locale_published_at_idx" ON "product_pages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "product_pages_documents_idx" ON "product_pages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "product_pages_updated_by_id_fk_idx" ON "product_pages"("updated_by_id");

-- CreateIndex
CREATE INDEX "product_pages_component_type_idx" ON "product_pages_cmps"("component_type");

-- CreateIndex
CREATE INDEX "product_pages_entity_fk_idx" ON "product_pages_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "product_pages_field_idx" ON "product_pages_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "product_pages_uq" ON "product_pages_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "products_created_by_id_fk_idx" ON "products"("created_by_id");

-- CreateIndex
CREATE INDEX "products_document_id_idx" ON "products"("document_id");

-- CreateIndex
CREATE INDEX "products_document_id_locale_published_at_idx" ON "products"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "products_documents_idx" ON "products"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "products_updated_by_id_fk_idx" ON "products"("updated_by_id");

-- CreateIndex
CREATE INDEX "products_categories_lnk_fk_idx" ON "products_categories_lnk"("product_id");

-- CreateIndex
CREATE INDEX "products_categories_lnk_ifk_idx" ON "products_categories_lnk"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_categories_lnk_uq" ON "products_categories_lnk"("product_id", "category_id");

-- CreateIndex
CREATE INDEX "social_networks_created_by_id_fk_idx" ON "social_networks"("created_by_id");

-- CreateIndex
CREATE INDEX "social_networks_document_id_idx" ON "social_networks"("document_id");

-- CreateIndex
CREATE INDEX "social_networks_document_id_locale_published_at_idx" ON "social_networks"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "social_networks_documents_idx" ON "social_networks"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "social_networks_updated_by_id_fk_idx" ON "social_networks"("updated_by_id");

-- CreateIndex
CREATE INDEX "social_networks_component_type_idx" ON "social_networks_cmps"("component_type");

-- CreateIndex
CREATE INDEX "social_networks_entity_fk_idx" ON "social_networks_cmps"("entity_id");

-- CreateIndex
CREATE INDEX "social_networks_field_idx" ON "social_networks_cmps"("field");

-- CreateIndex
CREATE UNIQUE INDEX "social_networks_uq" ON "social_networks_cmps"("entity_id", "cmp_id", "field", "component_type");

-- CreateIndex
CREATE INDEX "store_events_created_by_id_fk_idx" ON "store_events"("created_by_id");

-- CreateIndex
CREATE INDEX "store_events_documents_idx" ON "store_events"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "store_events_updated_by_id_fk_idx" ON "store_events"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_created_by_id_fk_idx" ON "strapi_api_token_permissions"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_document_id_idx" ON "strapi_api_token_permissions"("document_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_document_id_locale_published_at_id" ON "strapi_api_token_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_documents_idx" ON "strapi_api_token_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_updated_by_id_fk_idx" ON "strapi_api_token_permissions"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_token_lnk_fk_idx" ON "strapi_api_token_permissions_token_lnk"("api_token_permission_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_token_lnk_ifk_idx" ON "strapi_api_token_permissions_token_lnk"("api_token_id");

-- CreateIndex
CREATE INDEX "strapi_api_token_permissions_token_lnk_oifk" ON "strapi_api_token_permissions_token_lnk"("api_token_permission_ord");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_api_token_permissions_token_lnk_uq" ON "strapi_api_token_permissions_token_lnk"("api_token_permission_id", "api_token_id");

-- CreateIndex
CREATE INDEX "strapi_api_tokens_created_by_id_fk_idx" ON "strapi_api_tokens"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_api_tokens_document_id_idx" ON "strapi_api_tokens"("document_id");

-- CreateIndex
CREATE INDEX "strapi_api_tokens_document_id_locale_published_at_idx" ON "strapi_api_tokens"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_api_tokens_documents_idx" ON "strapi_api_tokens"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_api_tokens_updated_by_id_fk_idx" ON "strapi_api_tokens"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_history_versions_created_by_id_fk_idx" ON "strapi_history_versions"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_created_by_id_fk_idx" ON "strapi_release_actions"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_document_id_idx" ON "strapi_release_actions"("document_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_document_id_locale_published_at_idx" ON "strapi_release_actions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_release_actions_documents_idx" ON "strapi_release_actions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_release_actions_updated_by_id_fk_idx" ON "strapi_release_actions"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_release_lnk_fk_idx" ON "strapi_release_actions_release_lnk"("release_action_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_release_lnk_ifk_idx" ON "strapi_release_actions_release_lnk"("release_id");

-- CreateIndex
CREATE INDEX "strapi_release_actions_release_lnk_oifk" ON "strapi_release_actions_release_lnk"("release_action_ord");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_release_actions_release_lnk_uq" ON "strapi_release_actions_release_lnk"("release_action_id", "release_id");

-- CreateIndex
CREATE INDEX "strapi_releases_created_by_id_fk_idx" ON "strapi_releases"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_releases_document_id_idx" ON "strapi_releases"("document_id");

-- CreateIndex
CREATE INDEX "strapi_releases_document_id_locale_published_at_idx" ON "strapi_releases"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_releases_documents_idx" ON "strapi_releases"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_releases_updated_by_id_fk_idx" ON "strapi_releases"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_created_by_id_fk_idx" ON "strapi_transfer_token_permissions"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_document_id_idx" ON "strapi_transfer_token_permissions"("document_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_document_id_locale_published_" ON "strapi_transfer_token_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_documents_idx" ON "strapi_transfer_token_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_updated_by_id_fk_idx" ON "strapi_transfer_token_permissions"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_token_lnk_fk_idx" ON "strapi_transfer_token_permissions_token_lnk"("transfer_token_permission_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_token_lnk_ifk_idx" ON "strapi_transfer_token_permissions_token_lnk"("transfer_token_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_token_permissions_token_lnk_oifk" ON "strapi_transfer_token_permissions_token_lnk"("transfer_token_permission_ord");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_transfer_token_permissions_token_lnk_uq" ON "strapi_transfer_token_permissions_token_lnk"("transfer_token_permission_id", "transfer_token_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_tokens_created_by_id_fk_idx" ON "strapi_transfer_tokens"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_tokens_document_id_idx" ON "strapi_transfer_tokens"("document_id");

-- CreateIndex
CREATE INDEX "strapi_transfer_tokens_document_id_locale_published_at_idx" ON "strapi_transfer_tokens"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_transfer_tokens_documents_idx" ON "strapi_transfer_tokens"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_transfer_tokens_updated_by_id_fk_idx" ON "strapi_transfer_tokens"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_created_by_id_fk_idx" ON "strapi_workflows"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_document_id_idx" ON "strapi_workflows"("document_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_document_id_locale_published_at_idx" ON "strapi_workflows"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_workflows_documents_idx" ON "strapi_workflows"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_workflows_updated_by_id_fk_idx" ON "strapi_workflows"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stage_required_to_publish_lnk_fk_idx" ON "strapi_workflows_stage_required_to_publish_lnk"("workflow_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stage_required_to_publish_lnk_ifk_idx" ON "strapi_workflows_stage_required_to_publish_lnk"("workflow_stage_id");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_workflows_stage_required_to_publish_lnk_uq" ON "strapi_workflows_stage_required_to_publish_lnk"("workflow_id", "workflow_stage_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_created_by_id_fk_idx" ON "strapi_workflows_stages"("created_by_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_document_id_idx" ON "strapi_workflows_stages"("document_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_document_id_locale_published_at_idx" ON "strapi_workflows_stages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_documents_idx" ON "strapi_workflows_stages"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_updated_by_id_fk_idx" ON "strapi_workflows_stages"("updated_by_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_permissions_lnk_fk_idx" ON "strapi_workflows_stages_permissions_lnk"("workflow_stage_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_permissions_lnk_ifk_idx" ON "strapi_workflows_stages_permissions_lnk"("permission_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_permissions_lnk_ofk" ON "strapi_workflows_stages_permissions_lnk"("permission_ord");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_workflows_stages_permissions_lnk_uq" ON "strapi_workflows_stages_permissions_lnk"("workflow_stage_id", "permission_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_workflow_lnk_fk_idx" ON "strapi_workflows_stages_workflow_lnk"("workflow_stage_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_workflow_lnk_ifk_idx" ON "strapi_workflows_stages_workflow_lnk"("workflow_id");

-- CreateIndex
CREATE INDEX "strapi_workflows_stages_workflow_lnk_oifk" ON "strapi_workflows_stages_workflow_lnk"("workflow_stage_ord");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_workflows_stages_workflow_lnk_uq" ON "strapi_workflows_stages_workflow_lnk"("workflow_stage_id", "workflow_id");

-- CreateIndex
CREATE INDEX "up_permissions_created_by_id_fk_idx" ON "up_permissions"("created_by_id");

-- CreateIndex
CREATE INDEX "up_permissions_document_id_idx" ON "up_permissions"("document_id");

-- CreateIndex
CREATE INDEX "up_permissions_document_id_locale_published_at_idx" ON "up_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_permissions_documents_idx" ON "up_permissions"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_permissions_updated_by_id_fk_idx" ON "up_permissions"("updated_by_id");

-- CreateIndex
CREATE INDEX "up_permissions_role_lnk_fk_idx" ON "up_permissions_role_lnk"("permission_id");

-- CreateIndex
CREATE INDEX "up_permissions_role_lnk_ifk_idx" ON "up_permissions_role_lnk"("role_id");

-- CreateIndex
CREATE INDEX "up_permissions_role_lnk_oifk" ON "up_permissions_role_lnk"("permission_ord");

-- CreateIndex
CREATE UNIQUE INDEX "up_permissions_role_lnk_uq" ON "up_permissions_role_lnk"("permission_id", "role_id");

-- CreateIndex
CREATE INDEX "up_roles_created_by_id_fk_idx" ON "up_roles"("created_by_id");

-- CreateIndex
CREATE INDEX "up_roles_document_id_idx" ON "up_roles"("document_id");

-- CreateIndex
CREATE INDEX "up_roles_document_id_locale_published_at_idx" ON "up_roles"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_roles_documents_idx" ON "up_roles"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_roles_updated_by_id_fk_idx" ON "up_roles"("updated_by_id");

-- CreateIndex
CREATE INDEX "up_users_created_by_id_fk_idx" ON "up_users"("created_by_id");

-- CreateIndex
CREATE INDEX "up_users_document_id_idx" ON "up_users"("document_id");

-- CreateIndex
CREATE INDEX "up_users_document_id_locale_published_at_idx" ON "up_users"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_users_documents_idx" ON "up_users"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "up_users_updated_by_id_fk_idx" ON "up_users"("updated_by_id");

-- CreateIndex
CREATE INDEX "up_users_role_lnk_fk_idx" ON "up_users_role_lnk"("user_id");

-- CreateIndex
CREATE INDEX "up_users_role_lnk_ifk_idx" ON "up_users_role_lnk"("role_id");

-- CreateIndex
CREATE INDEX "up_users_role_lnk_oifk" ON "up_users_role_lnk"("user_ord");

-- CreateIndex
CREATE UNIQUE INDEX "up_users_role_lnk_uq" ON "up_users_role_lnk"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "upload_folders_path_id_index" ON "upload_folders"("path_id");

-- CreateIndex
CREATE UNIQUE INDEX "upload_folders_path_index" ON "upload_folders"("path");

-- CreateIndex
CREATE INDEX "upload_folders_created_by_id_fk_idx" ON "upload_folders"("created_by_id");

-- CreateIndex
CREATE INDEX "upload_folders_document_id_idx" ON "upload_folders"("document_id");

-- CreateIndex
CREATE INDEX "upload_folders_document_id_locale_published_at_idx" ON "upload_folders"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "upload_folders_documents_idx" ON "upload_folders"("document_id", "locale", "published_at");

-- CreateIndex
CREATE INDEX "upload_folders_updated_by_id_fk_idx" ON "upload_folders"("updated_by_id");

-- CreateIndex
CREATE INDEX "upload_folders_parent_lnk_fk_idx" ON "upload_folders_parent_lnk"("folder_id");

-- CreateIndex
CREATE INDEX "upload_folders_parent_lnk_ifk_idx" ON "upload_folders_parent_lnk"("inv_folder_id");

-- CreateIndex
CREATE INDEX "upload_folders_parent_lnk_oifk" ON "upload_folders_parent_lnk"("folder_ord");

-- CreateIndex
CREATE UNIQUE INDEX "upload_folders_parent_lnk_uq" ON "upload_folders_parent_lnk"("folder_id", "inv_folder_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addresses_user_lnk" ADD CONSTRAINT "addresses_user_lnk_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addresses_user_lnk" ADD CONSTRAINT "addresses_user_lnk_ifk" FOREIGN KEY ("user_id") REFERENCES "up_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_permissions_role_lnk" ADD CONSTRAINT "admin_permissions_role_lnk_fk" FOREIGN KEY ("permission_id") REFERENCES "admin_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_permissions_role_lnk" ADD CONSTRAINT "admin_permissions_role_lnk_ifk" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users_roles_lnk" ADD CONSTRAINT "admin_users_roles_lnk_fk" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users_roles_lnk" ADD CONSTRAINT "admin_users_roles_lnk_ifk" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_cards_graph_cards_cmps" ADD CONSTRAINT "components_cards_graph_cards_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_cards_graph_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_cards_ray_cards_cmps" ADD CONSTRAINT "components_cards_ray_cards_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_cards_ray_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_cards_social_media_cards_logos_lnk" ADD CONSTRAINT "components_cards_social_media_cards_logos_lnk_fk" FOREIGN KEY ("social_media_card_id") REFERENCES "components_cards_social_media_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_cards_social_media_cards_logos_lnk" ADD CONSTRAINT "components_cards_social_media_cards_logos_lnk_ifk" FOREIGN KEY ("logo_id") REFERENCES "logos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_brands_logos_lnk" ADD CONSTRAINT "components_dynamic_zone_brands_logos_lnk_fk" FOREIGN KEY ("brands_id") REFERENCES "components_dynamic_zone_brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_brands_logos_lnk" ADD CONSTRAINT "components_dynamic_zone_brands_logos_lnk_ifk" FOREIGN KEY ("logo_id") REFERENCES "logos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_ctas_cmps" ADD CONSTRAINT "components_dynamic_zone_ctas_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_ctas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_faqs_faqs_lnk" ADD CONSTRAINT "components_dynamic_zone_faqs_faqs_lnk_fk" FOREIGN KEY ("faq_id") REFERENCES "components_dynamic_zone_faqs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_faqs_faqs_lnk" ADD CONSTRAINT "components_dynamic_zone_faqs_faqs_lnk_ifk" FOREIGN KEY ("inv_faq_id") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_features_cmps" ADD CONSTRAINT "components_dynamic_zone_features_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_features"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_form_n2610e_social_networks_lnk" ADD CONSTRAINT "components_dynamic_zone_form_n2610e_social_net2db5f_ifk" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_form_n2610e_social_networks_lnk" ADD CONSTRAINT "components_dynamic_zone_form_n2610e_social_netw2db5f_fk" FOREIGN KEY ("form_next_to_section_id") REFERENCES "components_dynamic_zone_form_next_to_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_form_next_to_sections_cmps" ADD CONSTRAINT "components_dynamic_zone_form_next_to_sections_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_form_next_to_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_heroes_cmps" ADD CONSTRAINT "components_dynamic_zone_heroes_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_heroes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_how_it_works_cmps" ADD CONSTRAINT "components_dynamic_zone_how_it_works_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_how_it_works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_launches_cmps" ADD CONSTRAINT "components_dynamic_zone_launches_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_launches"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_related_products_products_lnk" ADD CONSTRAINT "components_dynamic_zone_related_products_produ898a7_ifk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_related_products_products_lnk" ADD CONSTRAINT "components_dynamic_zone_related_products_produc898a7_fk" FOREIGN KEY ("related_products_id") REFERENCES "components_dynamic_zone_related_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_rich_texts_cmps" ADD CONSTRAINT "components_dynamic_zone_rich_texts_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_rich_texts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_dynamic_zone_story_panels_cmps" ADD CONSTRAINT "components_dynamic_zone_story_panels_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_dynamic_zone_story_panels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_footers_cmps" ADD CONSTRAINT "components_global_footers_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_global_footers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_footers_logo_lnk" ADD CONSTRAINT "components_global_footers_logo_lnk_fk" FOREIGN KEY ("footer_id") REFERENCES "components_global_footers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_footers_logo_lnk" ADD CONSTRAINT "components_global_footers_logo_lnk_ifk" FOREIGN KEY ("logo_id") REFERENCES "logos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_footers_social_networks_lnk" ADD CONSTRAINT "components_global_footers_social_networks_lnk_fk" FOREIGN KEY ("footer_id") REFERENCES "components_global_footers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_footers_social_networks_lnk" ADD CONSTRAINT "components_global_footers_social_networks_lnk_ifk" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_navbars_cmps" ADD CONSTRAINT "components_global_navbars_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_global_navbars"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_navbars_logo_lnk" ADD CONSTRAINT "components_global_navbars_logo_lnk_fk" FOREIGN KEY ("navbar_id") REFERENCES "components_global_navbars"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_global_navbars_logo_lnk" ADD CONSTRAINT "components_global_navbars_logo_lnk_ifk" FOREIGN KEY ("logo_id") REFERENCES "logos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_shared_forms_cmps" ADD CONSTRAINT "components_shared_forms_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_shared_forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_shared_sections_cmps" ADD CONSTRAINT "components_shared_sections_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_shared_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "components_shared_social_media_icon_links_cmps" ADD CONSTRAINT "components_shared_social_media_icon_links_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "components_shared_social_media_icon_links"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_folder_lnk" ADD CONSTRAINT "files_folder_lnk_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_folder_lnk" ADD CONSTRAINT "files_folder_lnk_ifk" FOREIGN KEY ("folder_id") REFERENCES "upload_folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_related_mph" ADD CONSTRAINT "files_related_mph_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "globals" ADD CONSTRAINT "globals_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "globals" ADD CONSTRAINT "globals_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "globals_cmps" ADD CONSTRAINT "globals_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "globals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "i18n_locale" ADD CONSTRAINT "i18n_locale_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "i18n_locale" ADD CONSTRAINT "i18n_locale_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "log_products" ADD CONSTRAINT "log_products_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "log_products" ADD CONSTRAINT "log_products_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_cmps" ADD CONSTRAINT "orders_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_shipping_address_lnk" ADD CONSTRAINT "orders_shipping_address_lnk_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_shipping_address_lnk" ADD CONSTRAINT "orders_shipping_address_lnk_ifk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_user_lnk" ADD CONSTRAINT "orders_user_lnk_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_user_lnk" ADD CONSTRAINT "orders_user_lnk_ifk" FOREIGN KEY ("user_id") REFERENCES "up_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page_visits" ADD CONSTRAINT "page_visits_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page_visits" ADD CONSTRAINT "page_visits_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pages_cmps" ADD CONSTRAINT "pages_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_infos" ADD CONSTRAINT "payment_infos_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_infos" ADD CONSTRAINT "payment_infos_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pricing_settings" ADD CONSTRAINT "pricing_settings_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pricing_settings" ADD CONSTRAINT "pricing_settings_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_pages" ADD CONSTRAINT "product_pages_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_pages" ADD CONSTRAINT "product_pages_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_pages_cmps" ADD CONSTRAINT "product_pages_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "product_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products_categories_lnk" ADD CONSTRAINT "products_categories_lnk_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products_categories_lnk" ADD CONSTRAINT "products_categories_lnk_ifk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_networks" ADD CONSTRAINT "social_networks_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_networks" ADD CONSTRAINT "social_networks_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_networks_cmps" ADD CONSTRAINT "social_networks_entity_fk" FOREIGN KEY ("entity_id") REFERENCES "social_networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_events" ADD CONSTRAINT "store_events_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_events" ADD CONSTRAINT "store_events_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_token_permissions" ADD CONSTRAINT "strapi_api_token_permissions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_token_permissions" ADD CONSTRAINT "strapi_api_token_permissions_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_token_permissions_token_lnk" ADD CONSTRAINT "strapi_api_token_permissions_token_lnk_fk" FOREIGN KEY ("api_token_permission_id") REFERENCES "strapi_api_token_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_token_permissions_token_lnk" ADD CONSTRAINT "strapi_api_token_permissions_token_lnk_ifk" FOREIGN KEY ("api_token_id") REFERENCES "strapi_api_tokens"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_tokens" ADD CONSTRAINT "strapi_api_tokens_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_api_tokens" ADD CONSTRAINT "strapi_api_tokens_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_history_versions" ADD CONSTRAINT "strapi_history_versions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_release_actions" ADD CONSTRAINT "strapi_release_actions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_release_actions" ADD CONSTRAINT "strapi_release_actions_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_release_actions_release_lnk" ADD CONSTRAINT "strapi_release_actions_release_lnk_fk" FOREIGN KEY ("release_action_id") REFERENCES "strapi_release_actions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_release_actions_release_lnk" ADD CONSTRAINT "strapi_release_actions_release_lnk_ifk" FOREIGN KEY ("release_id") REFERENCES "strapi_releases"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_releases" ADD CONSTRAINT "strapi_releases_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_releases" ADD CONSTRAINT "strapi_releases_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_token_permissions" ADD CONSTRAINT "strapi_transfer_token_permissions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_token_permissions" ADD CONSTRAINT "strapi_transfer_token_permissions_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_token_permissions_token_lnk" ADD CONSTRAINT "strapi_transfer_token_permissions_token_lnk_fk" FOREIGN KEY ("transfer_token_permission_id") REFERENCES "strapi_transfer_token_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_token_permissions_token_lnk" ADD CONSTRAINT "strapi_transfer_token_permissions_token_lnk_ifk" FOREIGN KEY ("transfer_token_id") REFERENCES "strapi_transfer_tokens"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_tokens" ADD CONSTRAINT "strapi_transfer_tokens_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_transfer_tokens" ADD CONSTRAINT "strapi_transfer_tokens_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows" ADD CONSTRAINT "strapi_workflows_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows" ADD CONSTRAINT "strapi_workflows_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stage_required_to_publish_lnk" ADD CONSTRAINT "strapi_workflows_stage_required_to_publish_lnk_fk" FOREIGN KEY ("workflow_id") REFERENCES "strapi_workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stage_required_to_publish_lnk" ADD CONSTRAINT "strapi_workflows_stage_required_to_publish_lnk_ifk" FOREIGN KEY ("workflow_stage_id") REFERENCES "strapi_workflows_stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages" ADD CONSTRAINT "strapi_workflows_stages_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages" ADD CONSTRAINT "strapi_workflows_stages_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages_permissions_lnk" ADD CONSTRAINT "strapi_workflows_stages_permissions_lnk_fk" FOREIGN KEY ("workflow_stage_id") REFERENCES "strapi_workflows_stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages_permissions_lnk" ADD CONSTRAINT "strapi_workflows_stages_permissions_lnk_ifk" FOREIGN KEY ("permission_id") REFERENCES "admin_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages_workflow_lnk" ADD CONSTRAINT "strapi_workflows_stages_workflow_lnk_fk" FOREIGN KEY ("workflow_stage_id") REFERENCES "strapi_workflows_stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "strapi_workflows_stages_workflow_lnk" ADD CONSTRAINT "strapi_workflows_stages_workflow_lnk_ifk" FOREIGN KEY ("workflow_id") REFERENCES "strapi_workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_permissions" ADD CONSTRAINT "up_permissions_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_permissions" ADD CONSTRAINT "up_permissions_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_permissions_role_lnk" ADD CONSTRAINT "up_permissions_role_lnk_fk" FOREIGN KEY ("permission_id") REFERENCES "up_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_permissions_role_lnk" ADD CONSTRAINT "up_permissions_role_lnk_ifk" FOREIGN KEY ("role_id") REFERENCES "up_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_roles" ADD CONSTRAINT "up_roles_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_roles" ADD CONSTRAINT "up_roles_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_users" ADD CONSTRAINT "up_users_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_users" ADD CONSTRAINT "up_users_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_users_role_lnk" ADD CONSTRAINT "up_users_role_lnk_fk" FOREIGN KEY ("user_id") REFERENCES "up_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_users_role_lnk" ADD CONSTRAINT "up_users_role_lnk_ifk" FOREIGN KEY ("role_id") REFERENCES "up_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "upload_folders" ADD CONSTRAINT "upload_folders_created_by_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "upload_folders" ADD CONSTRAINT "upload_folders_updated_by_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "upload_folders_parent_lnk" ADD CONSTRAINT "upload_folders_parent_lnk_fk" FOREIGN KEY ("folder_id") REFERENCES "upload_folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "upload_folders_parent_lnk" ADD CONSTRAINT "upload_folders_parent_lnk_ifk" FOREIGN KEY ("inv_folder_id") REFERENCES "upload_folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

