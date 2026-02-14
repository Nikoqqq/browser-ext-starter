export default defineBackground(() => {
  console.log("Browser Extension Starter loaded", { id: browser.runtime.id });
});
