import fs from 'fs';

const CITY = 'Кривий Ріг';

const CATEGORY_KEYS = ['amenity', 'shop', 'office', 'tourism', 'healthcare'];

const BUSINESS_CATEGORIES = {
    FOOD: 'Заклади харчування',
    GROCERY: 'Продукти та супермаркети',
    MALLS: 'Торгові центри та Універмаги',
    CLOTHES: 'Одяг, взуття та аксесуари',
    ELECTRONICS: 'Електроніка та побутова техніка',
    HOME: 'Будинок, ремонт та будівництво',
    HEALTH: "Медицина та здоров'я",
    BEAUTY: 'Послуги краси',
    BUSINESS: 'Бізнес, фінанси та сервіси',
    TOURISM: 'Туризм та відпочинок'
};

const RAW_CATEGORY_TO_BUSINESS_CATEGORY = {
    cafe: BUSINESS_CATEGORIES.FOOD,
    restaurant: BUSINESS_CATEGORIES.FOOD,
    fast_food: BUSINESS_CATEGORIES.FOOD,
    bar: BUSINESS_CATEGORIES.FOOD,
    pub: BUSINESS_CATEGORIES.FOOD,

    supermarket: BUSINESS_CATEGORIES.GROCERY,
    convenience: BUSINESS_CATEGORIES.GROCERY,

    mall: BUSINESS_CATEGORIES.MALLS,
    department_store: BUSINESS_CATEGORIES.MALLS,

    clothes: BUSINESS_CATEGORIES.CLOTHES,
    shoes: BUSINESS_CATEGORIES.CLOTHES,
    jewelry: BUSINESS_CATEGORIES.CLOTHES,
    bag: BUSINESS_CATEGORIES.CLOTHES,

    electronics: BUSINESS_CATEGORIES.ELECTRONICS,
    computer: BUSINESS_CATEGORIES.ELECTRONICS,
    mobile_phone: BUSINESS_CATEGORIES.ELECTRONICS,
    appliance: BUSINESS_CATEGORIES.ELECTRONICS,

    doityourself: BUSINESS_CATEGORIES.HOME,
    hardware: BUSINESS_CATEGORIES.HOME,
    furniture: BUSINESS_CATEGORIES.HOME,
    building_materials: BUSINESS_CATEGORIES.HOME,

    pharmacy: BUSINESS_CATEGORIES.HEALTH,
    clinic: BUSINESS_CATEGORIES.HEALTH,
    hospital: BUSINESS_CATEGORIES.HEALTH,
    dentist: BUSINESS_CATEGORIES.HEALTH,
    doctors: BUSINESS_CATEGORIES.HEALTH,

    beauty: BUSINESS_CATEGORIES.BEAUTY,
    hairdresser: BUSINESS_CATEGORIES.BEAUTY,
    cosmetics: BUSINESS_CATEGORIES.BEAUTY,

    bank: BUSINESS_CATEGORIES.BUSINESS,
    atm: BUSINESS_CATEGORIES.BUSINESS,
    company: BUSINESS_CATEGORIES.BUSINESS,
    it: BUSINESS_CATEGORIES.BUSINESS,
    lawyer: BUSINESS_CATEGORIES.BUSINESS,
    insurance: BUSINESS_CATEGORIES.BUSINESS,

    hotel: BUSINESS_CATEGORIES.TOURISM,
    guest_house: BUSINESS_CATEGORIES.TOURISM,
    hostel: BUSINESS_CATEGORIES.TOURISM,
    museum: BUSINESS_CATEGORIES.TOURISM,
    attraction: BUSINESS_CATEGORIES.TOURISM
};

const normalizeName = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
};

const normalizeCategoryValue = (categoryName) => {
    return String(categoryName).trim().toLowerCase();
};

const getOrganizationName = (properties) => {
    return properties.name
        ?? properties['name:ua']
        ?? properties['name:uk']
        ?? properties['name:en']
        ?? null;
};

const getRawCategoryNames = (properties) => {
    return CATEGORY_KEYS
        .map((key) => properties[key])
        .filter((categoryName) => categoryName !== undefined && categoryName !== null);
};

const getBusinessCategoryName = (properties) => {
    const rawCategoryNames = getRawCategoryNames(properties);

    for (const rawCategoryName of rawCategoryNames) {
        const normalizedRawCategoryName = normalizeCategoryValue(rawCategoryName);
        const businessCategoryName = RAW_CATEGORY_TO_BUSINESS_CATEGORY[normalizedRawCategoryName];

        if (businessCategoryName) {
            return businessCategoryName;
        }
    }

    return null;
};

const getOrganizationGroupKey = (organizationName, businessCategoryName) => {
    const normalizedOrganizationName = normalizeName(organizationName);
    const normalizedBusinessCategoryName = businessCategoryName
        ? normalizeName(businessCategoryName)
        : 'without-category';

    return `${normalizedOrganizationName}:${normalizedBusinessCategoryName}`;
};

const getWebsiteUrl = (properties) => {
    return properties.website
        ?? properties['contact:website']
        ?? properties.url
        ?? null;
};

const splitPhoneNumbers = (phoneValue) => {
    if (!phoneValue) {
        return [];
    }

    return String(phoneValue)
        .split(';')
        .map((phoneNumber) => phoneNumber.trim())
        .filter((phoneNumber) => phoneNumber.length > 0);
};

const getPhoneNumbers = (properties) => {
    const phoneFields = [
        properties.phone,
        properties['contact:phone'],
        properties['phone:UA']
    ];

    const phoneNumbers = phoneFields.flatMap(splitPhoneNumbers);

    return [...new Set(phoneNumbers)];
};

const getSocialLinks = (properties) => {
    const socialLinks = {};

    const facebook = properties['contact:facebook'] ?? properties.facebook ?? null;
    const instagram = properties['contact:instagram'] ?? properties.instagram ?? null;
    const telegram = properties['contact:telegram'] ?? properties.telegram ?? null;

    if (facebook) {
        socialLinks.facebook = facebook;
    }

    if (instagram) {
        socialLinks.instagram = instagram;
    }

    if (telegram) {
        socialLinks.telegram = telegram;
    }

    return socialLinks;
};

const getContacts = (properties) => {
    const contacts = {};

    const phoneNumbers = getPhoneNumbers(properties);
    const email = properties.email ?? properties['contact:email'] ?? null;

    if (phoneNumbers.length > 0) {
        contacts.phone_numbers = phoneNumbers;
    }

    if (email) {
        contacts.email = email;
    }

    return contacts;
};

const mergePhoneNumbers = (oldContacts, newContacts) => {
    const oldPhoneNumbers = oldContacts.phone_numbers ?? [];
    const newPhoneNumbers = newContacts.phone_numbers ?? [];

    const mergedPhoneNumbers = [...new Set([
        ...oldPhoneNumbers,
        ...newPhoneNumbers
    ])];

    if (mergedPhoneNumbers.length > 0) {
        oldContacts.phone_numbers = mergedPhoneNumbers;
    }
};

const mergeOrganizationData = (organization, properties) => {
    const newContacts = getContacts(properties);
    const newSocialLinks = getSocialLinks(properties);
    const newWebsiteUrl = getWebsiteUrl(properties);

    mergePhoneNumbers(organization.contacts, newContacts);

    if (!organization.contacts.email && newContacts.email) {
        organization.contacts.email = newContacts.email;
    }

    organization.social_links = {
        ...organization.social_links,
        ...newSocialLinks
    };

    if (!organization.website_url && newWebsiteUrl) {
        organization.website_url = newWebsiteUrl;
    }

    if (!organization.working_hours && properties.opening_hours) {
        organization.working_hours = properties.opening_hours;
    }

    if (!organization.description && properties.description) {
        organization.description = properties.description;
    }
};

const parseGeoJson = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const geoJson = JSON.parse(fileContent);

    const organizationsMap = new Map();
    const categoriesMap = new Map();
    const organizationCategoriesSet = new Set();

    const organizations = [];
    const categories = [];
    const locations = [];
    const organizationCategories = [];

    let organizationId = 1;
    let categoryId = 1;
    let locationId = 1;

    for (const feature of geoJson.features ?? []) {
        const properties = feature.properties ?? {};
        const geometry = feature.geometry ?? {};

        const organizationName = getOrganizationName(properties);

        if (!organizationName) {
            continue;
        }

        const businessCategoryName = getBusinessCategoryName(properties);
        const organizationGroupKey = getOrganizationGroupKey(
            organizationName,
            businessCategoryName
        );

        let organization = organizationsMap.get(organizationGroupKey);

        if (!organization) {
            organization = {
                org_id: organizationId++,
                name: organizationName,
                description: properties.description ?? null,
                status: 'approved',
                social_links: getSocialLinks(properties),
                website_url: getWebsiteUrl(properties),
                contacts: getContacts(properties),
                working_hours: properties.opening_hours ?? null,
                created_at: null,
                updated_at: null,
                appoved_at: null,
                rejection_reason: null
            };

            organizationsMap.set(organizationGroupKey, organization);
            organizations.push(organization);
        } else {
            mergeOrganizationData(organization, properties);
        }

        if (businessCategoryName !== null) {
            let category = categoriesMap.get(businessCategoryName);

            if (!category) {
                category = {
                    category_id: categoryId++,
                    name: businessCategoryName
                };

                categoriesMap.set(businessCategoryName, category);
                categories.push(category);
            }

            const relationKey = `${organization.org_id}:${category.category_id}`;

            if (!organizationCategoriesSet.has(relationKey)) {
                organizationCategoriesSet.add(relationKey);

                organizationCategories.push({
                    org_id: organization.org_id,
                    category_id: category.category_id
                });
            }
        }

        const coordinates = geometry.coordinates ?? [];

        const longitude = coordinates[0] ?? null;
        const latitude = coordinates[1] ?? null;

        locations.push({
            location_id: locationId++,
            organization_id: organization.org_id,
            street: properties['addr:street'] ?? null,
            building: properties['addr:housenumber'] ?? null,
            city: CITY,
            region: properties['addr:region'] ?? null,
            post_code: properties['addr:postcode'] ?? null,
            latitude,
            longitude
        });
    }

    return {
        CATEGORIES: categories,
        ORGANIZATIONS: organizations,
        LOCATIONS: locations,
        ORGANIZATION_CATIGORIES: organizationCategories
    };
};

export default parseGeoJson;