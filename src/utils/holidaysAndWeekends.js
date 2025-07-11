

export default {
  uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    )
  },
  weekend2024: [
    {
      "Year": 2024,
      "Month": 1,
      "Days": "1,2,3,4,5,6,7,8,13,14,20,21,27,28"
    },
    {
      "Year": 2024,
      "Month": 2,
      "Days": "3,4,10,11,17,18,22,23,24,25"
    },
    {
      "Year": 2024,
      "Month": 3,
      "Days": "2,3,7,8,9,10,16,17,23,24,30,31"
    },
    {
      "Year": 2024,
      "Month": 4,
      "Days": "6,7,13,14,20,21,28,29,30"
    },
    {
      "Year": 2024,
      "Month": 5,
      "Days": "1,4,5,8,9,10,11,12,18,19,25,26"
    },
    {
      "Year": 2024,
      "Month": 6,
      "Days": "1,2,8,9,11,12,15,16,22,23,29,30"
    },
    {
      "Year": 2024,
      "Month": 7,
      "Days": "6,7,13,14,20,21,27,28"
    },
    {
      "Year": 2024,
      "Month": 8,
      "Days": "3,4,10,11,17,18,24,25,31"
    },
    {
      "Year": 2024,
      "Month": 9,
      "Days": "1,7,8,14,15,21,22,28,29"
    },
    {
      "Year": 2024,
      "Month": 10,
      "Days": "5,6,12,13,19,20,26,27"
    },
    {
      "Year": 2024,
      "Month": 11,
      "Days": "2,3,4,9,10,16,17,23,24,30"
    },
    {
      "Year": 2024,
      "Month": 12,
      "Days": "1,7,8,14,15,21,22,29,30,31"
    }
  ],
  
}  
