export { default as Login } from "./auth/login";
export { default as ForgotPassword } from "./auth/forgotPassword";
export { default as ResetPassword } from "./auth/reset-password";
export { default as Blogs } from "./content-manager/blog";
export { default as BluePrint } from "./content-manager/blue-print";
export { default as BookClub } from "./content-manager/book-club";
export { default as Clips } from "./content-manager/clips";
export { default as Library } from "./content-manager/library";
export { default as Whistle } from "./content-manager/whistle";
export { default as Dashboard } from "./dashboard";
export { default as Lounges } from "./paid-content/lounge";
export { default as Tapes } from "./paid-content/tape";
export { default as Practice } from "./paid-content/practice";
export { default as AddUser } from "./user-managment/expired-plan";
export { default as Plans } from "./vorame-plans/plan";
export { default as Promotions } from "./vorame-plans/promotion";
export { default as Promos } from "./vorame-plans/promos";
export { default as Faqs } from "./faq";
export { default as NotFound } from "./404";

export const modulesHasmap = {
    "Blogs": "./blogs",
    "Blue Print": "./blueprint",
    "Book Club": "./bookclub",
    "Clips": "./clips",
    "Library": "./library",
    "Whistle": "./whistle",
    "Dashboard": "./",
    "Lounges": "./lounge",
    "Tapes": "./tape",
    "Concepts": "./concepts",
    "Users": "./users",
    "Add User": "./user/add",
    "Plans": "./plans",
    "Promotions": "./promotions",
    "Promos": "./promos",
    "Faqs": "./faqs",
};

