/**
 * Page to queue a print job
 *
 */
function doGet() {
  return HtmlService.createTemplateFromFile("/html/Index").evaluate();
}
