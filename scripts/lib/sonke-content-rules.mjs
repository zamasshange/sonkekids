export function buildReplacementRules(content) {
  const rules = [];

  for (const mapping of Object.values(content.propertyMap)) {
    if (mapping.pbsTitle && mapping.worldTitle) {
      rules.push([mapping.pbsTitle, mapping.worldTitle]);
    }
  }

  for (const item of content.games.overrides) {
    if (item.pbsTitle && item.title) {
      rules.push([item.pbsTitle, item.title]);
    }
    if (item.pbsAlt && item.alt) {
      rules.push([item.pbsAlt, item.alt]);
    }
  }

  for (const item of content.videos.overrides) {
    if (item.pbsTitle && item.title) {
      rules.push([item.pbsTitle, item.title]);
    }
    if (item.pbsSubtitle && item.subtitle) {
      rules.push([item.pbsSubtitle, item.subtitle]);
    }
  }

  for (const [from, to] of content.terminology.replacements) {
    rules.push([from, to]);
  }

  return expandRuleVariants(rules);
}

function expandRuleVariants(rules) {
  const expanded = new Map();

  for (const [from, to] of rules) {
    for (const variant of textVariants(from)) {
      if (!expanded.has(variant)) {
        expanded.set(variant, to);
      }
    }
  }

  return [...expanded.entries()].sort((a, b) => b[0].length - a[0].length);
}

function textVariants(value) {
  const variants = new Set([value]);
  variants.add(value.replace(/'/g, "\u2019"));
  variants.add(value.replace(/'/g, "&#x27;"));
  variants.add(value.replace(/'/g, "&#39;"));
  variants.add(value.replace(/&/g, "&amp;"));
  variants.add(value.replace(/&/g, "\\u0026"));
  return [...variants];
}

export function applyRulesToString(text, rules) {
  let updated = text;
  for (const [from, to] of rules) {
    if (from && updated.includes(from)) {
      updated = updated.replaceAll(from, to);
    }
  }
  return updated;
}
