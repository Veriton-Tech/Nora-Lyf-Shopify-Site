# Collection Setup Instructions

This document explains how to set up collections for the GetSupp theme to enable product filtering by category.

## Collections to Create

Create the following collections in your Shopify admin:

### 1. Health & Wellness
- **Handle**: `health-wellness`
- **Title**: Health & Wellness
- **Description**: Discover our range of health and wellness supplements designed to support your overall well-being.

### 2. Herbal & Ayurveda
- **Handle**: `herbal-ayurveda`
- **Title**: Herbal & Ayurveda
- **Description**: Explore our traditional herbal and Ayurvedic supplements for natural health and wellness.

### 3. Vitamins & Supplements
- **Handle**: `vitamins-supplements`
- **Title**: Vitamins & Supplements
- **Description**: Essential vitamins and supplements to support your daily nutritional needs and health goals.

### 4. Health Foods
- **Handle**: `health-foods`
- **Title**: Health Foods
- **Description**: Nutritious health foods and superfoods to fuel your body with natural goodness.

### 5. Sports Nutrition
- **Handle**: `sports-nutrition`
- **Title**: Sports Nutrition
- **Description**: High-performance sports nutrition products to support your fitness and athletic goals.

### 6. Brands
- **Handle**: `brands`
- **Title**: Brands
- **Description**: Explore products from trusted brands and manufacturers in the health and wellness industry.

## How to Create Collections

1. Go to **Products > Collections** in your Shopify admin
2. Click **Create collection**
3. Choose **Manual** collection type
4. Fill in the collection details as specified above
5. Save the collection

## Product Categorization

The theme includes automatic product filtering based on:

### Keywords for Health & Wellness
- health, wellness, general, immune, digestive, heart, mental, stress, energy, detox, antioxidant

### Keywords for Herbal & Ayurveda
- herbal, ayurveda, ayurvedic, traditional, herbs, plant-based, natural, organic, ashwagandha, turmeric, ginger, neem

### Keywords for Vitamins & Supplements
- vitamin, vitamins, supplement, supplements, mineral, minerals, multivitamin, b-complex, vitamin-c, vitamin-d, calcium, iron, zinc

### Keywords for Health Foods
- food, superfood, protein, greens, supergreens, spirulina, chia, flax, quinoa, organic, raw, whole

### Keywords for Sports Nutrition
- sports, fitness, workout, gym, protein, creatine, pre-workout, post-workout, muscle, bcaa, amino, recovery

### Keywords for Brands
- Any product with a vendor/brand name

## How It Works

1. **Primary Method**: If collections exist and have products, they will display normally
2. **Fallback Method**: If collections are empty or don't exist, the theme will automatically filter products from all products based on keywords in:
   - Product title
   - Product type
   - Product tags
   - Product vendor (for brands)

## Product Tagging Recommendations

To ensure products appear in the correct categories, add relevant tags to your products:

- **Health & Wellness products**: Add tags like "health", "wellness", "immune", "digestive"
- **Herbal products**: Add tags like "herbal", "ayurveda", "natural", "organic"
- **Vitamins**: Add tags like "vitamin", "supplement", "multivitamin"
- **Health Foods**: Add tags like "superfood", "protein", "organic", "raw"
- **Sports Nutrition**: Add tags like "sports", "fitness", "protein", "workout"

## Testing

After setting up collections:

1. Visit each category page (e.g., `/collections/health-wellness`)
2. Check if products are displayed correctly
3. Verify that product counts are dynamic
4. Test the filtering functionality

## Troubleshooting

- If products don't appear in categories, check that product titles, types, or tags contain the relevant keywords
- If product counts show as "0", ensure products have the correct tags or keywords
- If collections show "No products found", the fallback filtering should automatically display relevant products
