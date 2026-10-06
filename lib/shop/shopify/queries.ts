// GraphQL documents for the Shopify Storefront API.

import { cmsDefinitions } from "../cms";

const worldMetafield = `world: metafield(namespace: "custom", key: "world") { value }`;

const productFields = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    availableForSale
    options(first: 3) {
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    images(first: 12) {
      nodes { url altText }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
    collections(first: 5) {
      nodes { handle }
    }
    seo { title description }
    ${worldMetafield}
    sizeChart: metafield(namespace: "custom", key: "size_chart") {
      reference { ... on Metaobject { handle } }
    }
    badge: metafield(namespace: "custom", key: "badge") { value }
  }
`;

const collectionFields = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image { url altText }
    seo { title description }
    subtitle: metafield(namespace: "custom", key: "subtitle") { value }
    ${worldMetafield}
    sample: products(first: 8) {
      nodes {
        productType
        tags
        featuredImage { url altText }
        ${worldMetafield}
      }
    }
  }
`;

const cartFields = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            image { url altText }
            product {
              id
              handle
              title
              productType
              tags
              featuredImage { url altText }
              ${worldMetafield}
            }
          }
        }
      }
    }
  }
`;

export const productQuery = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
  ${productFields}
`;

export const productsQuery = /* GraphQL */ `
  query Products($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductFields }
    }
  }
  ${productFields}
`;

export const collectionProductsQuery = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      products(first: $first, after: $after, sortKey: COLLECTION_DEFAULT) {
        pageInfo { hasNextPage endCursor }
        nodes { ...ProductFields }
      }
    }
  }
  ${productFields}
`;

export const recommendationsQuery = /* GraphQL */ `
  query Recommendations($productId: ID!) {
    productRecommendations(productId: $productId) { ...ProductFields }
  }
  ${productFields}
`;

export const searchQuery = /* GraphQL */ `
  query Search($query: String!) {
    search(query: $query, first: 60, types: PRODUCT) {
      nodes {
        ... on Product { ...ProductFields }
      }
    }
  }
  ${productFields}
`;

export const collectionQuery = /* GraphQL */ `
  query Collection($handle: String!) {
    collection(handle: $handle) { ...CollectionFields }
  }
  ${collectionFields}
`;

export const collectionsQuery = /* GraphQL */ `
  query Collections {
    collections(first: 100) {
      nodes { ...CollectionFields }
    }
  }
  ${collectionFields}
`;

export const cartQuery = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
  ${cartFields}
`;

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
  ${cartFields}
`;

export const cartLinesAddMutation = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
  ${cartFields}
`;

export const cartLinesUpdateMutation = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
  ${cartFields}
`;

export const cartLinesRemoveMutation = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { message }
    }
  }
  ${cartFields}
`;

const menuItemFields = /* GraphQL */ `
  fragment MenuItemFields on MenuItem {
    title
    url
    type
    resource {
      ... on Collection {
        handle
        ${worldMetafield}
        sample: products(first: 8) {
          nodes {
            productType
            tags
            ${worldMetafield}
          }
        }
      }
      ... on Product {
        handle
        productType
        tags
        ${worldMetafield}
      }
    }
  }
`;

export const menuQuery = /* GraphQL */ `
  query Menu($handle: String!) {
    menu(handle: $handle) {
      items {
        ...MenuItemFields
        items {
          ...MenuItemFields
          items { ...MenuItemFields }
        }
      }
    }
  }
  ${menuItemFields}
`;

const metaobjectFields = /* GraphQL */ `
  fragment MetaobjectFields on Metaobject {
    id
    handle
    fields {
      key
      value
      reference {
        ... on MediaImage { image { url altText } }
        ... on Collection { handle }
        ... on Metaobject { handle }
      }
      references(first: 24) {
        nodes {
          ... on MediaImage { image { url altText } }
          ... on Collection { handle }
        }
      }
    }
  }
`;

export const metaobjectsQuery = /* GraphQL */ `
  query Metaobjects($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      nodes { ...MetaobjectFields }
    }
  }
  ${metaobjectFields}
`;

/** Every content metaobject type from lib/shop/cms.ts, aliased c0, c1, … */
export const cmsQuery = /* GraphQL */ `
  query Cms {
    ${cmsDefinitions
      .map(
        (definition, index) =>
          `c${index}: metaobjects(type: "${definition.type}", first: ${definition.list ? 50 : 1}) {
      nodes { ...MetaobjectFields }
    }`
      )
      .join("\n    ")}
  }
  ${metaobjectFields}
`;

export const pageQuery = /* GraphQL */ `
  query Page($handle: String!) {
    page(handle: $handle) {
      handle
      title
      body
      seo { title description }
    }
  }
`;

export const policiesQuery = /* GraphQL */ `
  query Policies {
    shop {
      privacyPolicy { handle title body }
      refundPolicy { handle title body }
      shippingPolicy { handle title body }
      termsOfService { handle title body }
    }
  }
`;
