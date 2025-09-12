const yaml = require('js-yaml');
const fs = require('fs-extra');

// App Metadata
console.log(`Compiling app metadata...`);
const appGlobalConfig = fs.readFileSync(`content/app.yml`, 'utf8');
try {
  fs.writeJsonSync('public/app.json', yaml.load(appGlobalConfig), {
    spaces: 2,
  });
} catch (e) {
  console.error(`::error:: app.yml is not valid yaml: ${e.message}`);
}

// Game Rules + Metadata
const finalRulesJSON = {};
const finalConfigJSON = {};
const finalErrataJSON = {};

const games = fs.readdirSync('content/rules');
games.forEach((game) => {
  finalRulesJSON[game] = {};
  finalConfigJSON[game] = {};
  finalErrataJSON[game] = {};

  console.log(`Compiling rules for ${game}...`);

  const locales = fs.readdirSync(`content/rules/${game}`);
  locales.forEach((locale) => {
    finalRulesJSON[game][locale] = {};
    finalErrataJSON[game][locale] = [];

    console.log(`Compiling rules for ${game}->${locale}...`);

    let hasError = false;

    if (!fs.existsSync(`content/rules/${game}/${locale}/appconfig.yml`)) {
      console.error(`::error:: ${game}->${locale} has no appconfig.yml file.`);
      hasError = true;
    }

    if (!hasError) {
      const appconfig = fs.readFileSync(
        `content/rules/${game}/${locale}/appconfig.yml`,
        'utf8',
      );
      try {
        finalConfigJSON[game][locale] = yaml.load(appconfig);
      } catch (e) {
        console.error(
          `::error:: ${game}->${locale} appconfig.yml is not valid yaml: ${e.message}`,
        );
      }
    }

    if (fs.existsSync(`content/rules/${game}/${locale}/errata.yml`)) {
      const errata = fs.readFileSync(
        `content/rules/${game}/${locale}/errata.yml`,
        'utf8',
      );
      try {
        finalErrataJSON[game][locale] = yaml.load(errata);
      } catch (e) {
        console.error(
          `::error:: ${game}->${locale} errata.yml is not valid yaml: ${e.message}`,
        );
      }
    }

    const printings = fs.readdirSync(`content/rules/${game}/${locale}`);
    printings.forEach((printing) => {
      if (printing.includes('.yml')) return;

      finalRulesJSON[game][locale][printing] = {};

      console.log(`Compiling rules for ${game}->${locale}->${printing}...`);

      if (
        !fs.existsSync(`content/rules/${game}/${locale}/${printing}/rules.yml`)
      ) {
        console.error(
          `::error:: ${game}->${locale}->${printing} has no rules.yml file.`,
        );
        hasError = true;
      }

      if (!hasError) {
        const gameLocaleVersionData = {};

        const rules = fs.readFileSync(
          `content/rules/${game}/${locale}/${printing}/rules.yml`,
          'utf8',
        );
        try {
          gameLocaleVersionData.rules = yaml.load(rules);
        } catch (e) {
          console.error(
            `::error:: ${game}->${locale}->${printing} rules.yml is not valid yaml: ${e.message}`,
          );
        }

        if (
          fs.existsSync(`content/rules/${game}/${locale}/${printing}/faq.yml`)
        ) {
          const faq = fs.readFileSync(
            `content/rules/${game}/${locale}/${printing}/faq.yml`,
            'utf8',
          );
          try {
            gameLocaleVersionData.faq = yaml.load(faq);
          } catch (e) {
            console.error(
              `::error:: ${game}->${locale}->${printing} faq.yml is not valid yaml: ${e.message}`,
            );
          }
        }

        finalRulesJSON[game][locale][printing] = gameLocaleVersionData;
      }
    });
  });
});

fs.writeJsonSync('public/rules.json', finalRulesJSON, { spaces: 2 });
fs.writeJsonSync('public/i18n.json', finalConfigJSON, { spaces: 2 });
fs.writeJsonSync('public/errata.json', finalErrataJSON, { spaces: 2 });
