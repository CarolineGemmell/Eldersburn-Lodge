/* Eldersburn Lodge website settings
   Update this file when prices or calendar details change */
window.ELDERSBURN_CONFIG = {
  outlookCalendarEmbedUrl: "https://outlook.live.com/owa/calendar/a67e3740-42f4-4f41-a824-fac723d87e4e/df94e8e6-bcf9-4515-b81a-0c09740ede9d/cid-E32883F8B1297C26/index.html",

  bookedDates: [
    "2026-08-07",
    "2026-08-08",
    "2026-08-09",
    "2026-08-10",
    "2026-08-14",
    "2026-08-15",
    "2026-08-16",
    "2026-08-17"
  ],

  prices: [
    {
      season: "Low season",
      dates: "January, February, March & December",
      stays: [
        { label: "4 nights", price: "£1,000" },
        { label: "7 nights", price: "£1,750" }
      ]
    },
    {
      season: "Mid season",
      dates: "April, May, October & November",
      stays: [
        { label: "4 nights", price: "£1,200" },
        { label: "7 nights", price: "£2,100" }
      ]
    },
    {
      season: "High season",
      dates: "June, July, August & September",
      stays: [
        { label: "4 nights", price: "£1,400" },
        { label: "7 nights", price: "£2,450" }
      ]
    },
    {
      season: "Christmas & New Year",
      dates: "Festive period",
      stays: [
        { label: "Festive stay", price: "£3,000" }
      ]
    }
  ],

  priceNotes: [
    "Minimum stay: 4 nights",
    "Cleaning charge: £100 per booking",
    "Refundable security deposit: £200",
    "No pets",
    "Standard changeover day: Monday",
    "Christmas and New Year dates and stay duration are confirmed when you enquire"
  ]
};
