import 'package:flutter/material.dart';

class LearningItem {
  final String id;
  final String nameEnglish;
  final String nameArabic;
  final String emoji;
  final String phonetic;
  final String? soundEffect;
  final String? hint;
  final String? detail;
  final String? detailArabic;

  LearningItem({
    required this.id,
    required this.nameEnglish,
    required this.nameArabic,
    required this.emoji,
    required this.phonetic,
    this.soundEffect,
    this.hint,
    this.detail,
    this.detailArabic,
  });
}

class CategoryItem {
  final String id;
  final String titleEn;
  final String titleAr;
  final String iconEmoji;
  final Color primaryColor;
  final Color secondaryColor;
  final List<LearningItem> items;

  CategoryItem({
    required this.id,
    required this.titleEn,
    required this.titleAr,
    required this.iconEmoji,
    required this.primaryColor,
    required this.secondaryColor,
    required this.items,
  });
}

class AppData {
  static final List<CategoryItem> categories = [
    // 1. ABC Alphabet
    CategoryItem(
      id: 'abc',
      titleEn: 'Alphabet',
      titleAr: 'الحروف الإنجليزية',
      iconEmoji: '🔤',
      primaryColor: const Color(0xFF3B82F6),
      secondaryColor: const Color(0xFF1D4ED8),
      items: [
        LearningItem(id: 'a', nameEnglish: 'A - Apple', nameArabic: 'أ - تفاح', emoji: '🍎', phonetic: '/ˈæp.əl/', detail: 'A is for Apple'),
        LearningItem(id: 'b', nameEnglish: 'B - Ball', nameArabic: 'ب - كرة', emoji: '⚽', phonetic: '/bɔːl/', detail: 'B is for Ball'),
        LearningItem(id: 'c', nameEnglish: 'C - Cat', nameArabic: 'س - قطة', emoji: '🐱', phonetic: '/kæt/', detail: 'C is for Cat'),
        LearningItem(id: 'd', nameEnglish: 'D - Dog', nameArabic: 'د - كلب', emoji: '🐶', phonetic: '/dɒɡ/', detail: 'D is for Dog'),
        LearningItem(id: 'e', nameEnglish: 'E - Elephant', nameArabic: 'إ - فيل', emoji: '🐘', phonetic: '/ˈel.ɪ.fənt/', detail: 'E is for Elephant'),
        LearningItem(id: 'f', nameEnglish: 'F - Fish', nameArabic: 'ف - سمكة', emoji: '🐟', phonetic: '/fɪʃ/', detail: 'F is for Fish'),
        LearningItem(id: 'g', nameEnglish: 'G - Giraffe', nameArabic: 'ج - زرافة', emoji: '🦒', phonetic: '/dʒɪˈrɑːf/', detail: 'G is for Giraffe'),
        LearningItem(id: 'h', nameEnglish: 'H - House', nameArabic: 'هـ - بيت', emoji: '🏠', phonetic: '/haʊs/', detail: 'H is for House'),
        LearningItem(id: 's', nameEnglish: 'S - Star', nameArabic: 'س - نجمة', emoji: '⭐', phonetic: '/stɑːr/', detail: 'S is for Star'),
        LearningItem(id: 'z', nameEnglish: 'Z - Zebra', nameArabic: 'ز - حمار وحشي', emoji: '🦓', phonetic: '/ˈziː.brə/', detail: 'Z is for Zebra'),
      ],
    ),

    // 2. Numbers
    CategoryItem(
      id: 'numbers',
      titleEn: 'Numbers',
      titleAr: 'الأرقام والحساب',
      iconEmoji: '🔢',
      primaryColor: const Color(0xFF8B5CF6),
      secondaryColor: const Color(0xFF6D28D9),
      items: [
        LearningItem(id: '1', nameEnglish: 'One', nameArabic: 'واحد (1)', emoji: '1️⃣', phonetic: '/wʌn/', detail: 'One sun in the sky ☀️'),
        LearningItem(id: '2', nameEnglish: 'Two', nameArabic: 'اثنان (2)', emoji: '2️⃣', phonetic: '/tuː/', detail: 'Two cute shoes 👟👟'),
        LearningItem(id: '3', nameEnglish: 'Three', nameArabic: 'ثلاثة (3)', emoji: '3️⃣', phonetic: '/θriː/', detail: 'Three little birds 🐦🐦🐦'),
        LearningItem(id: '4', nameEnglish: 'Four', nameArabic: 'أربعة (4)', emoji: '4️⃣', phonetic: '/fɔːr/', detail: 'Four car wheels 🚗'),
        LearningItem(id: '5', nameEnglish: 'Five', nameArabic: 'خمسة (5)', emoji: '5️⃣', phonetic: '/faɪv/', detail: 'Five fingers on a hand 🖐️'),
        LearningItem(id: '10', nameEnglish: 'Ten', nameArabic: 'عشرة (10)', emoji: '🔟', phonetic: '/ten/', detail: 'Ten shining stars ⭐'),
      ],
    ),

    // 3. Fruits (منفصلة)
    CategoryItem(
      id: 'fruits',
      titleEn: 'Fruits',
      titleAr: 'الفواكه اللذيذة',
      iconEmoji: '🍎',
      primaryColor: const Color(0xFFEF4444),
      secondaryColor: const Color(0xFFB91C1C),
      items: [
        LearningItem(id: 'apple', nameEnglish: 'Apple', nameArabic: 'تفاح', emoji: '🍎', phonetic: '/ˈæp.əl/', detail: 'Sweet and crunchy fruit!'),
        LearningItem(id: 'banana', nameEnglish: 'Banana', nameArabic: 'موز', emoji: '🍌', phonetic: '/bəˈnæn.ə/', detail: 'Full of potassium and energy!'),
        LearningItem(id: 'strawberry', nameEnglish: 'Strawberry', nameArabic: 'فراولة', emoji: '🍓', phonetic: '/ˈstrɔː.bər.i/', detail: 'Sweet, red, and delicious!'),
        LearningItem(id: 'watermelon', nameEnglish: 'Watermelon', nameArabic: 'بطيخ', emoji: '🍉', phonetic: '/ˈwɔː.təˌmel.ən/', detail: 'Juicy summer treat!'),
        LearningItem(id: 'orange', nameEnglish: 'Orange', nameArabic: 'برتقال', emoji: '🍊', phonetic: '/ˈɒr.ɪndʒ/', detail: 'Packed with Vitamin C!'),
        LearningItem(id: 'grapes', nameEnglish: 'Grapes', nameArabic: 'عنب', emoji: '🍇', phonetic: '/ɡreɪps/', detail: 'Sweet bunches of purple and green!'),
        LearningItem(id: 'pineapple', nameEnglish: 'Pineapple', nameArabic: 'أناناس', emoji: '🍍', phonetic: '/ˈpaɪnˌæp.əl/', detail: 'Tropical and tangy!'),
        LearningItem(id: 'mango', nameEnglish: 'Mango', nameArabic: 'مانجو', emoji: '🥭', phonetic: '/ˈmæŋ.ɡəʊ/', detail: 'King of all fruits!'),
      ],
    ),

    // 4. Vegetables (منفصلة)
    CategoryItem(
      id: 'vegetables',
      titleEn: 'Vegetables',
      titleAr: 'الخضروات الصحية',
      iconEmoji: '🥕',
      primaryColor: const Color(0xFF10B981),
      secondaryColor: const Color(0xFF047857),
      items: [
        LearningItem(id: 'carrot', nameEnglish: 'Carrot', nameArabic: 'جزر', emoji: '🥕', phonetic: '/ˈkær.ət/', detail: 'Crunchy and great for eyes!'),
        LearningItem(id: 'broccoli', nameEnglish: 'Broccoli', nameArabic: 'بروكلي', emoji: '🥦', phonetic: '/ˈbrɒk.əl.i/', detail: 'Looks like cute little green trees!'),
        LearningItem(id: 'tomato', nameEnglish: 'Tomato', nameArabic: 'طماطم', emoji: '🍅', phonetic: '/təˈmɑː.təʊ/', detail: 'Juicy red healthy vegetable!'),
        LearningItem(id: 'cucumber', nameEnglish: 'Cucumber', nameArabic: 'خيار', emoji: '🥒', phonetic: '/ˈkjuː.kʌm.bər/', detail: 'Cool and refreshing!'),
        LearningItem(id: 'corn', nameEnglish: 'Corn', nameArabic: 'ذرة', emoji: '🌽', phonetic: '/kɔːn/', detail: 'Sweet yellow kernels!'),
        LearningItem(id: 'potato', nameEnglish: 'Potato', nameArabic: 'بطاطس', emoji: '🥔', phonetic: '/pəˈteɪ.təʊ/', detail: 'We make yummy mashed potatoes!'),
        LearningItem(id: 'eggplant', nameEnglish: 'Eggplant', nameArabic: 'باذنجان', emoji: '🍆', phonetic: '/ˈeɡ.plɑːnt/', detail: 'Beautiful glossy purple vegetable!'),
      ],
    ),

    // 5. Weather (حالات الطقس - منفصلة)
    CategoryItem(
      id: 'weather',
      titleEn: 'Weather',
      titleAr: 'حالات الطقس والجو',
      iconEmoji: '☀️',
      primaryColor: const Color(0xFF0284C7),
      secondaryColor: const Color(0xFF0369A1),
      items: [
        LearningItem(id: 'sunny', nameEnglish: 'Sunny', nameArabic: 'مشمس', emoji: '☀️', phonetic: '/ˈsʌn.i/', detail: 'Bright yellow sun is shining!'),
        LearningItem(id: 'rainy', nameEnglish: 'Rainy', nameArabic: 'ممطر', emoji: '🌧️', phonetic: '/ˈreɪ.ni/', detail: 'Pitter-patter water drops fall!'),
        LearningItem(id: 'cloudy', nameEnglish: 'Cloudy', nameArabic: 'غائم', emoji: '☁️', phonetic: '/ˈklaʊ.di/', detail: 'The sky is full of soft clouds!'),
        LearningItem(id: 'snowy', nameEnglish: 'Snowy', nameArabic: 'مثلج', emoji: '❄️', phonetic: '/ˈsnəʊ.i/', detail: 'White snowflakes falling softly!'),
        LearningItem(id: 'windy', nameEnglish: 'Windy', nameArabic: 'عاصف / رياح', emoji: '💨', phonetic: '/ˈwɪn.di/', detail: 'Whooosh! Leaves are flying!'),
        LearningItem(id: 'rainbow', nameEnglish: 'Rainbow', nameArabic: 'قوس قزح', emoji: '🌈', phonetic: '/ˈreɪn.bəʊ/', detail: 'Seven magical colors in the sky!'),
        LearningItem(id: 'hot', nameEnglish: 'Hot', nameArabic: 'حار', emoji: '🌡️', phonetic: '/hɒt/', detail: 'Summer days are warm and hot!'),
        LearningItem(id: 'cold', nameEnglish: 'Cold', nameArabic: 'بارد', emoji: '🥶', phonetic: '/kəʊld/', detail: 'Brrr! Wear a cozy jacket!'),
      ],
    ),

    // 6. Seasons (فصول السنة - منفصلة)
    CategoryItem(
      id: 'seasons',
      titleEn: 'Seasons',
      titleAr: 'فصول السنة الأربعة',
      iconEmoji: '🌸',
      primaryColor: const Color(0xFFF59E0B),
      secondaryColor: const Color(0xFFB45309),
      items: [
        LearningItem(id: 'spring', nameEnglish: 'Spring', nameArabic: 'فصل الربيع', emoji: '🌸', phonetic: '/sprɪŋ/', detail: 'Flowers bloom and birds sing!'),
        LearningItem(id: 'summer', nameEnglish: 'Summer', nameArabic: 'فصل الصيف', emoji: '🏖️', phonetic: '/ˈsʌm.ər/', detail: 'Time for swimming and beach fun!'),
        LearningItem(id: 'autumn', nameEnglish: 'Autumn / Fall', nameArabic: 'فصل الخريف', emoji: '🍂', phonetic: '/ˈɔː.təm/', detail: 'Golden leaves fall from trees!'),
        LearningItem(id: 'winter', nameEnglish: 'Winter', nameArabic: 'فصل الشتاء', emoji: '⛄', phonetic: '/ˈwɪn.tər/', detail: 'Building snowmen and drinking hot cocoa!'),
      ],
    ),

    // 7. Vehicles & Transport
    CategoryItem(
      id: 'vehicles',
      titleEn: 'Vehicles',
      titleAr: 'المواصلات والمركبات',
      iconEmoji: '🚗',
      primaryColor: const Color(0xFF6366F1),
      secondaryColor: const Color(0xFF4338CA),
      items: [
        LearningItem(id: 'car', nameEnglish: 'Car', nameArabic: 'سيارة', emoji: '🚗', phonetic: '/kɑːr/', detail: 'Beep beep! On the road.'),
        LearningItem(id: 'airplane', nameEnglish: 'Airplane', nameArabic: 'طائرة', emoji: '✈️', phonetic: '/ˈeə.pleɪn/', detail: 'Whooosh! High in the clouds.'),
        LearningItem(id: 'rocket', nameEnglish: 'Rocket', nameArabic: 'صاروخ فضائي', emoji: '🚀', phonetic: '/ˈrɒk.ɪt/', detail: '3, 2, 1... Blast off to the moon!'),
        LearningItem(id: 'train', nameEnglish: 'Train', nameArabic: 'قطار', emoji: '🚆', phonetic: '/treɪn/', detail: 'Choo Choo on the tracks!'),
        LearningItem(id: 'ship', nameEnglish: 'Ship', nameArabic: 'سفينة', emoji: '🚢', phonetic: '/ʃɪp/', detail: 'Sails across the ocean.'),
      ],
    ),

    // 8. Body Parts
    CategoryItem(
      id: 'body',
      titleEn: 'Body Parts',
      titleAr: 'أجزاء جسم الإنسان',
      iconEmoji: '👀',
      primaryColor: const Color(0xFFEC4899),
      secondaryColor: const Color(0xFFBE185D),
      items: [
        LearningItem(id: 'eyes', nameEnglish: 'Eyes', nameArabic: 'عينان', emoji: '👀', phonetic: '/aɪz/', detail: 'We see colors and shapes.'),
        LearningItem(id: 'ears', nameEnglish: 'Ears', nameArabic: 'أذنان', emoji: '👂', phonetic: '/ɪəz/', detail: 'We hear beautiful songs.'),
        LearningItem(id: 'nose', nameEnglish: 'Nose', nameArabic: 'أنف', emoji: '👃', phonetic: '/nəʊz/', detail: 'We smell sweet flowers.'),
        LearningItem(id: 'mouth', nameEnglish: 'Mouth', nameArabic: 'فم', emoji: '👄', phonetic: '/maʊθ/', detail: 'We talk and eat delicious food.'),
        LearningItem(id: 'hands', nameEnglish: 'Hands', nameArabic: 'يدان', emoji: '🖐️', phonetic: '/hændz/', detail: 'We clap and draw!'),
      ],
    ),

    // 9. Animals
    CategoryItem(
      id: 'animals',
      titleEn: 'Animals',
      titleAr: 'عالم الحيوانات',
      iconEmoji: '🦁',
      primaryColor: const Color(0xFFD97706),
      secondaryColor: const Color(0xFF92400E),
      items: [
        LearningItem(id: 'lion', nameEnglish: 'Lion', nameArabic: 'أسد', emoji: '🦁', phonetic: '/ˈlaɪ.ən/', soundEffect: 'Roaaar!', detail: 'King of the jungle.'),
        LearningItem(id: 'cat', nameEnglish: 'Cat', nameArabic: 'قطة', emoji: '🐱', phonetic: '/kæt/', soundEffect: 'Meow Meow!', detail: 'Playful and cute.'),
        LearningItem(id: 'dog', nameEnglish: 'Dog', nameArabic: 'كلب', emoji: '🐶', phonetic: '/dɒɡ/', soundEffect: 'Woof Woof!', detail: 'Man\'s best friend.'),
        LearningItem(id: 'duck', nameEnglish: 'Duck', nameArabic: 'بطة', emoji: '🦆', phonetic: '/dʌk/', soundEffect: 'Quack Quack!', detail: 'Swims in the pond.'),
      ],
    ),
  ];
}
