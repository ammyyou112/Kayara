// Shared by the server layout (inline <head> script) and the client BrandLoader.
export const INTRO_SEEN_KEY = "kayra-intro-seen";

// Runs before paint so returning visitors in the same session never see the
// intro, not even for a frame.
export const introScript = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}"))document.documentElement.dataset.introSeen="1"}catch(e){}`;
