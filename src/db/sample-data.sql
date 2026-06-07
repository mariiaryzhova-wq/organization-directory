INSERT INTO organizations (
    name,
    description,
    website_url,
    status,
    approved_at,
    rejection_reason,
    created_at,
    updated_at
)
VALUES
    (
        'Green Future Foundation',
        'Environmental organization focused on urban tree planting and eco education programs.',
        'https://greenfuture.org',
        'approved',
        '2025-01-12 10:00:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'CodeBridge Academy',
        'Educational platform providing free programming courses for teenagers and beginners.',
        'https://codebridge.dev',
        'approved',
        '2025-02-01 09:30:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Health First Initiative',
        'Non-profit organization supporting local healthcare access in small communities.',
        'https://healthfirst.example',
        'pending',
        NULL,
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Animal Rescue Network',
        'Volunteer-driven shelter and adoption network for homeless animals.',
        'https://animalrescue.net',
        'approved',
        '2025-01-25 14:15:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'NextGen Robotics Club',
        'Community organization promoting robotics and STEM workshops for students.',
        'https://nextgenrobotics.club',
        'pending',
        NULL,
        NULL,
        NOW(),
        NOW()
    ),
    (
        'City Food Bank',
        'Local food bank providing support and meal distribution for families in need.',
        'https://cityfoodbank.org',
        'approved',
        '2025-03-03 11:45:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Creative Minds Studio',
        'Art and design collective organizing workshops, exhibitions, and youth programs.',
        'https://creativeminds.studio',
        'rejected',
        NULL,
        'Submitted documents were incomplete and require resubmission.',
        NOW(),
        NOW()
    ),
    (
        'Digital Freedom Watch',
        'Advocacy group focused on digital rights, privacy, and internet accessibility.',
        'https://digitalfreedom.watch',
        'approved',
        '2025-02-18 16:20:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Community Sports Alliance',
        'Organization supporting youth sports activities and local tournaments.',
        'https://sportsalliance.org',
        'pending',
        NULL,
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Solar Energy Hub',
        'Educational and consulting center for renewable energy adoption.',
        'https://solarhub.energy',
        'approved',
        '2025-04-10 08:10:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Women in Tech Network',
        'Professional community supporting women in software engineering and IT careers.',
        'https://womenintech.network',
        'approved',
        '2025-03-15 13:00:00',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'Urban Shelter Project',
        'Organization helping provide temporary housing and rehabilitation services.',
        'https://urbanshelterproject.org',
        'rejected',
        NULL,
        'Organization verification could not be completed.',
        NOW(),
        NOW()
    );

INSERT INTO categories (name)
VALUES
    ('Education'),
    ('Healthcare'),
    ('Environment'),
    ('Technology'),
    ('Animals'),
    ('Food Support'),
    ('Arts & Culture'),
    ('Digital Rights'),
    ('Sports'),
    ('Renewable Energy'),
    ('Women Empowerment'),
    ('Housing & Shelter');


INSERT INTO organization_categories (
    organization_id,
    category_id
)
VALUES
-- Green Future Foundation
(1, 3),

-- CodeBridge Academy
(2, 1),
(2, 4),

-- Health First Initiative
(3, 2),

-- Animal Rescue Network
(4, 5),

-- NextGen Robotics Club
(5, 1),
(5, 4),

-- City Food Bank
(6, 6),

-- Creative Minds Studio
(7, 7),

-- Digital Freedom Watch
(8, 8),
(8, 4),

-- Community Sports Alliance
(9, 9),

-- Solar Energy Hub
(10, 10),
(10, 3),

-- Women in Tech Network
(11, 11),
(11, 4),
(11, 1),

-- Urban Shelter Project
(12, 12);

INSERT INTO locations (
    organization_id,
    street,
    city,
    region,
    zip_code,
    latitude,
    longitude
)
VALUES
    (
        1,
        '15 Poshtovyi Ave',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50000',
        47.9101000,
        33.3918000
    ),
    (
        2,
        '42 Heroiv ATO Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50005',
        47.9145000,
        33.4012000
    ),
    (
        3,
        '8 Metalurhiv Ave',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50027',
        47.8968000,
        33.4203000
    ),
    (
        4,
        '21 Sobornosti Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50036',
        47.9214000,
        33.3821000
    ),
    (
        5,
        '10 Universytetska Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50051',
        47.9387000,
        33.4324000
    ),
    (
        6,
        '33 Tsentralnyi Ave',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50065',
        47.9019000,
        33.3765000
    ),
    (
        7,
        '12 Kobylianskoho Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50071',
        47.9296000,
        33.4158000
    ),
    (
        8,
        '7 Freedom Square',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50074',
        47.9173000,
        33.3946000
    ),
    (
        9,
        '18 Sportyvna Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50079',
        47.9442000,
        33.4479000
    ),
    (
        10,
        '5 Soniachna Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50082',
        47.8874000,
        33.3617000
    ),
    (
        11,
        '27 IT Park Avenue',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50086',
        47.9251000,
        33.4055000
    ),
    (
        12,
        '9 Hromadska Street',
        'Kryvyi Rih',
        'Dnipropetrovsk Oblast',
        '50089',
        47.8986000,
        33.4381000
    );