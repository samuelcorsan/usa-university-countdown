const universities = [
  {
    name: "Harvard University",
    domain: "harvard.edu",
    notificationEarly: "12-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
  },
  {
    name: "Stanford University",
    domain: "stanford.edu",
    notificationEarly: "13-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Massachusetts Institute of Technology",
    domain: "mit.edu",
    notificationEarly: "17-12-24", // Mid-December 2024
    time: "18:28",
    notificationRegular: "14-03-25", // Mid-March 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "California Institute of Technology",
    domain: "caltech.edu",
    notificationEarly: "12-12-24", // Mid-December 2024
    notificationRegular: "15-03-25", // Mid-March 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Columbia University",
    domain: "columbia.edu",
    notificationEarly: "18-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
  },
  {
    name: "Princeton University",
    domain: "princeton.edu",
    notificationEarly: "12-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Yale University",
    domain: "yale.edu",
    notificationEarly: "17-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    time: "17:00",
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Cornell University",
    domain: "cornell.edu",
    notificationEarly: "12-12-24", // Mid-December 2024
    notificationRegular: "01-04-25", // Early April 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "University of Pennsylvania",
    domain: "upenn.edu",
    notificationEarly: "19-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
  },
  {
    name: "Johns Hopkins University",
    domain: "jhu.edu",
    notificationEarly: "13-12-24", // December 13, 2024
    notificationRegular: "15-03-25", // Mid-March 2025
    fileExists: true,
    time: "15:00",
    notConfirmedDate: false,
  },
  {
    name: "New York University",
    domain: "nyu.edu",
    notificationEarly: "12-12-24", // Mid-December 2024
    notificationRegular: "01-04-25", // Early April 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Northwestern University",
    domain: "northwestern.edu",
    notificationEarly: "17-12-24", // Mid-December 2024
    notificationRegular: "01-04-25", // Early April 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Duke University",
    domain: "duke.edu",
    notificationEarly: "16-12-24", // Mid-December 2024
    notificationRegular: "01-04-25", // Early April 2025
    fileExists: true,
  },
  {
    name: "Dartmouth College",
    domain: "dartmouth.edu",
    notificationEarly: "13-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    time: "15:00",
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Brown University",
    domain: "brown.edu",
    notificationEarly: "13-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    fileExists: true,
    notConfirmedDate: false,
  },
  {
    name: "Pomona College",
    domain: "pomona.edu",
    notificationEarly: "13-12-24", // Mid-December 2024
    notificationRegular: "28-03-25", // Late March 2025
    time: "20:00",
    fileExists: true,
    notConfirmedDate: false,
  },
] as University[];
type University = {
  name: string;
  domain: string;
  notificationEarly: string;
  notificationRegular: string;
  fileExists: boolean;
  notConfirmedDate?: boolean;
  time?: string;
};
export default universities;
export type { University };
