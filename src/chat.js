const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint = "https://myopenaieus.openai.azure.com/" //process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = "8768bbd8b12f405b938982d80135576f" //process.env["AZURE_OPENAI_API_KEY"] ;

const prompt = ["When was Microsoft founded?"];

async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "mychatbot";
  const result = await client.getCompletions(deploymentId, prompt);

  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };