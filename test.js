import test from "ava";
import check from "./dist/mcgorgeous.common";

test("Correct string type", t => {
  const sitesSchema = [{ name: "string" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test(`Don't freak out on "null" schema type`, t => {
  const sitesSchema = [{ name: "null" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test(`Don't freak out on \`null\` schema type`, t => {
  const sitesSchema = [{ name: null }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("String can be null or blank", t => {
  const sitesSchema = [{ name: "string" }];
  const sitesData = [{ name: null }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Number can be null or blank", t => {
  const sitesSchema = [{ age: "number" }];
  const sitesData = [{ age: null }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Boolean can be null or blank", t => {
  const sitesSchema = [{ age: "boolean" }];
  const sitesData = [{ age: null }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Array can be empty", t => {
  const sitesSchema = { data: [["number", "number"]] };
  const sitesData = { data: [] };
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("String cannot be null no error", t => {
  const sitesSchema = [{ name: "string notnull" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Number cannot be null no error", t => {
  const sitesSchema = [{ points: "number notnull" }];
  const sitesData = [{ points: 0 }, { points: 0 }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Boolean cannot be null no error", t => {
  const sitesSchema = [{ points: "boolean notnull" }];
  const sitesData = [{ points: false }, { points: false }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("String cannot be null throws error", t => {
  const sitesSchema = [{ name: "string notnull" }];
  const sitesData = [{ name: null }, { name: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, "String cannot be null");
});

test("Boolean cannot be null throws error", t => {
  const sitesSchema = [{ happy: "boolean notnull" }];
  const sitesData = [{ happy: false }, { happy: null }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, "Boolean cannot be null");
});

test("Number cannot be null throws error", t => {
  const sitesSchema = [{ age: "number notnull" }];
  const sitesData = [{ age: null }, { age: null }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, "Number cannot be null");
});

test("Wrong string type", t => {
  const sitesSchema = [{ name: "string" }];
  const sitesData = [{ name: 0 }, { name: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"0" is not a string.');
});

test("Correct numeric type", t => {
  const sitesSchema = [{ id: "number" }];
  const sitesData = [{ id: 3 }, { id: 4 }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong numeric type", t => {
  const sitesSchema = [{ id: "number" }];
  const sitesData = [{ id: 0 }, { id: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"Gary" is not a number.');
});

test("Correct boolean type", t => {
  const sitesSchema = [{ has_power: "boolean" }];
  const sitesData = [{ has_power: true }, { has_power: false }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong boolean type", t => {
  const sitesSchema = [{ has_power: "boolean" }];
  const sitesData = [{ has_power: true }, { has_power: "false" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"false" is not a boolean.');
});

test("Correct base object structure", t => {
  const sitesSchema = [{ id: "number", name: "string", has_power: "boolean" }];
  const sitesData = [
    { id: 24601, name: "Janice", has_power: false },
    { id: 24602, name: "Gary", has_power: true }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong base object structure", t => {
  const sitesSchema = [{ id: "number", name: "string", has_power: "boolean" }];
  const sitesData = [[1, 2, 3]];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, `Schema is looking for "object", data is [1,2,3]`);
});

test("Correct base array structure", t => {
  const sitesSchema = [{ id: "number", name: "string", powers: ["string"] }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: ["fire", "ice"] },
    { id: 24602, name: "Gary", powers: ["fire", "magic"] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong base array structure", t => {
  const sitesSchema = [{ id: "number", name: "string", powers: ["string"] }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: { power1: "fire", power2: "ice" } },
    { id: 24602, name: "Gary", powers: { power1: "fire", power2: "magic" } }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(
    error.message,
    'Schema is looking for "array", data is {"power1":"fire","power2":"magic"}'
  );
});

test("Correct Array of ints", t => {
  const sitesSchema = [{ ratings: ["number"] }];
  const sitesData = [
    { ratings: [0, 5, 3, 8, 7, 9] },
    { ratings: [0, 5, 2, 9] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong Array of ints", t => {
  const sitesSchema = [{ ratings: ["number"] }];
  const sitesData = [
    { ratings: [0, 5, "3", 8, 7, 9] },
    { ratings: [0, 5, 2, 9] }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"3" is not a number.');
});

test("Correct Array of booleans", t => {
  const sitesSchema = [{ ratings: ["boolean"] }];
  const sitesData = [
    { ratings: [true, false, true, false, true] },
    { ratings: [true, false, false, true] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong Array of booleans", t => {
  const sitesSchema = [{ ratings: ["boolean"] }];
  const sitesData = [
    { ratings: [true, false, true, false, true] },
    { ratings: [true, false, 9, true] }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"9" is not a boolean.');
});

test("Order of keys does not matter", t => {
  const sitesSchema = [{ powers: ["string"], name: "string", id: "number" }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: ["fire", "ice"] },
    { powers: ["fire", "magic"], id: 24602, name: "Gary" }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Correctly deeply nested", t => {
  const sitesSchema = [
    {
      powers: [
        {
          id: "string",
          name: [{ id: "string", num: "number", avail: "boolean" }]
        }
      ],
      name: "string",
      id: "number"
    }
  ];
  const sitesData = [
    {
      powers: [
        { id: "fjeijd", name: [{ id: "239jrj", num: 443, avail: false }] }
      ],
      name: "Gary",
      id: 232333
    },
    {
      powers: [
        { id: "dfdf33e", name: [{ id: "dsds", num: 3232, avail: true }] }
      ],
      name: "Susan",
      id: 22233344556
    },
    {
      powers: [
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] },
        {
          id: "2wk2wk",
          name: [
            { id: "33dfd", num: 398574, avail: true },
            { id: "dfkdf", num: 398574, avail: false },
            { id: "nvnfvnf", num: 398574, avail: true }
          ]
        },
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] }
      ],
      name: "Vivian",
      id: 3984574874
    }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong deeply nested", t => {
  const sitesSchema = [
    {
      powers: [
        {
          id: "string",
          name: [{ id: "string", num: "number", avail: "boolean" }]
        }
      ],
      name: "string",
      id: "number"
    }
  ];
  const sitesData = [
    {
      powers: [
        { id: "fjeijd", name: [{ id: "239jrj", num: 443, avail: false }] }
      ],
      name: "Gary",
      id: 232333
    },
    {
      powers: [
        { id: "dfdf33e", name: [{ id: "dsds", num: 3232, avail: true }] }
      ],
      name: "Susan",
      id: 22233344556
    },
    {
      powers: [
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] },
        {
          id: "2wk2wk",
          name: [
            { id: "33dfd", num: 398574, avail: true },
            { id: "dfkdf", num: "398574", avail: false },
            { id: "nvnfvnf", num: 398574, avail: true }
          ]
        },
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] }
      ],
      name: "Vivian",
      id: 3984574874
    }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"398574" is not a number.');
});

test("Unknown schema type", t => {
  const sitesSchema = [{ name: "array" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, 'Unknown schema type: "array"');
});

test("Handle null values and large schemas", t => {
  const sitesSchema = {
    id: "string",
    site_id: "string",
    plan: "string",
    plan_data: {
      title: "string",
      asset_acceleration: "boolean",
      form_processing: "boolean",
      cdn_propagation: "string",
      build_gc_exchange: "string",
      build_node_pool: "string",
      build_cluster: "string",
      domain_aliases: "boolean",
      secure_site: "boolean",
      prerendering: "boolean",
      proxying: "boolean",
      ssl: "string",
      rate_cents: "number",
      yearly_rate_cents: "number",
      cdn_network: "string",
      ipv6_domain: "string",
      branch_deploy: "boolean",
      managed_dns: "boolean",
      geo_ip: "boolean",
      split_testing: "boolean",
      id: "string"
    },
    ssl_plan: null,
    premium: "boolean",
    claimed: "boolean",
    name: "string",
    custom_domain: null,
    domain_aliases: [],
    password: null,
    notification_email: null,
    url: "string",
    admin_url: "string",
    deploy_id: "string",
    build_id: "string",
    deploy_url: "string",
    state: "string",
    screenshot_url: null,
    created_at: "string",
    updated_at: "string",
    user_id: "string",
    error_message: null,
    ssl: "boolean",
    ssl_url: "string",
    force_ssl: null,
    ssl_status: null,
    max_domain_aliases: "number",
    build_settings: {},
    processing_settings: {
      css: { bundle: "boolean", minify: "boolean" },
      js: { bundle: "boolean", minify: "boolean" },
      images: { optimize: "boolean" },
      html: { pretty_urls: "boolean" },
      skip: "boolean"
    },
    prerender: null,
    prerender_headers: null,
    deploy_hook: null,
    published_deploy: "null",
    managed_dns: "boolean",
    jwt_secret: null,
    jwt_roles_path: "string",
    account_slug: "string",
    account_name: "string",
    account_type: "string",
    capabilities: {
      title: "string",
      asset_acceleration: "boolean",
      form_processing: "boolean",
      cdn_propagation: "string",
      build_gc_exchange: "string",
      build_node_pool: "string",
      build_cluster: "string",
      domain_aliases: "boolean",
      secure_site: "boolean",
      prerendering: "boolean",
      proxying: "boolean",
      ssl: "string",
      rate_cents: "number",
      yearly_rate_cents: "number",
      cdn_network: "string",
      ipv6_domain: "string",
      branch_deploy: "boolean",
      managed_dns: "boolean",
      geo_ip: "boolean",
      split_testing: "boolean",
      id: "string"
    },
    active_subscription_ids: [],
    external_contributors_enabled: "boolean",
    paid_individual_site_subscription: "boolean",
    dns_zone_id: null,
    identity_instance_id: null,
    use_functions: null,
    parent_user_id: null,
    automatic_tls_provisioning: null,
    disabled: null,
    lifecycle_state: "string",
    id_domain: "string",
    use_lm: null,
    build_image: "string",
    has_analytics_data: "boolean",
    analytics_enabled: "boolean",
    automatic_tls_provisioning_expired: "boolean"
  };
  const sitesData = {
    id: "4fe62c79-2afa-4f7b-8fbe-3fd42330a60f",
    site_id: "4fe62c79-2afa-4f7b-8fbe-3fd42330a60f",
    plan: "nf_team_dev",
    plan_data: {
      title: "Netlify Team Free",
      asset_acceleration: true,
      form_processing: true,
      cdn_propagation: "partial",
      build_gc_exchange: "buildbot-gc",
      build_node_pool: "buildbot-external-ssd",
      build_cluster: "buildbot-3",
      domain_aliases: true,
      secure_site: false,
      prerendering: true,
      proxying: true,
      ssl: "custom",
      rate_cents: 0,
      yearly_rate_cents: 0,
      cdn_network: "free_cdn_network",
      ipv6_domain: "cdn.makerloop.com",
      branch_deploy: true,
      managed_dns: true,
      geo_ip: true,
      split_testing: true,
      id: "nf_team_dev"
    },
    ssl_plan: null,
    premium: false,
    claimed: true,
    name: "js-netlify-react-ui",
    custom_domain: null,
    domain_aliases: [],
    password: null,
    notification_email: null,
    url: "http://js-netlify-react-ui.netlify.com",
    admin_url: "https://app.netlify.com/sites/js-netlify-react-ui",
    deploy_id: "",
    build_id: "",
    deploy_url: "http://.js-netlify-react-ui.netlify.com",
    state: "current",
    screenshot_url: null,
    created_at: "2019-07-01T19:13:01.312Z",
    updated_at: "2019-07-01T19:13:01.312Z",
    user_id: "fancy_user_id_goes_here",
    error_message: null,
    ssl: false,
    ssl_url: "https://js-netlify-react-ui.netlify.com",
    force_ssl: null,
    ssl_status: null,
    max_domain_aliases: 100,
    build_settings: {},
    processing_settings: {
      css: { bundle: true, minify: true },
      js: { bundle: true, minify: true },
      images: { optimize: true },
      html: { pretty_urls: true },
      skip: true
    },
    prerender: null,
    prerender_headers: null,
    deploy_hook: null,
    published_deploy: null,
    managed_dns: true,
    jwt_secret: null,
    jwt_roles_path: "app_metadata.authorization.roles",
    account_slug: "js1-kfjkf9j94jd",
    account_name: "Gary S's team",
    account_type: "personal",
    capabilities: {
      title: "Netlify Team Free",
      asset_acceleration: true,
      form_processing: true,
      cdn_propagation: "partial",
      build_gc_exchange: "buildbot-gc",
      build_node_pool: "buildbot-external-ssd",
      build_cluster: "buildbot-3",
      domain_aliases: true,
      secure_site: false,
      prerendering: true,
      proxying: true,
      ssl: "custom",
      rate_cents: 0,
      yearly_rate_cents: 0,
      cdn_network: "free_cdn_network",
      ipv6_domain: "cdn.makerloop.com",
      branch_deploy: true,
      managed_dns: true,
      geo_ip: true,
      split_testing: true,
      id: "nf_team_dev"
    },
    active_subscription_ids: [],
    external_contributors_enabled: false,
    paid_individual_site_subscription: false,
    dns_zone_id: null,
    identity_instance_id: null,
    use_functions: null,
    parent_user_id: null,
    automatic_tls_provisioning: null,
    disabled: null,
    lifecycle_state: "active",
    id_domain: "fancy_domain_93438493u9u3r3.netlify.com",
    use_lm: null,
    build_image: "xenial",
    has_analytics_data: false,
    analytics_enabled: false,
    automatic_tls_provisioning_expired: false
  };
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});
