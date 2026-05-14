const categories = {
  'Food': ['burger', 'mcdonalds', 'pizza', 'restaurant', 'cafe', 'grocery', 'starbucks', 'food', 'dining', 'meal', 'kfc', 'dominos', 'foodpanda', 'swiggy', 'zomato'],
  'Transport': ['uber', 'lyft', 'gas', 'petrol', 'train', 'metro', 'bus', 'flight','travel', 'taxi', 'cab', 'bus', 'subway', 'transport'],
  'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'gaming', 'concert', 'entertainment', 'hulu', 'disney+', 'amazon prime'],
  'Bills': ['electricity', 'water', 'internet', 'rent', 'insurance', 'bill', 'subscription', 'phone', 'utilities', 'gas bill'],
  'Healthcare': ['pharmacy', 'doctor', 'hospital', 'medicine', 'dentist', 'healthcare', 'clinic', 'medical'],
  'Education': ['tuition', 'books', 'course', 'udemy', 'coursera', 'education', 'school', 'college', 'university'],
  'Shopping': ['amazon', 'flipkart', 'clothing', 'electronics', 'shopping', 'mall', 'apparel', 'shoes', 'accessories', 'fashion'],
};

exports.autoCategorize = (title) => {
  const lowerTitle = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category;
    }
  }
  
  return 'Miscellaneous';
};