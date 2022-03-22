import axios from "axios";

export default async function DescriptionAbilities(url) {
    let description = [];
    await axios
        .get(url)
        .then(descriptionRes => {
            if (descriptionRes.data.effect_entries[0].language.name === "en")
                description[descriptionRes.data.name] = descriptionRes.data.effect_entries[0].short_effect;
            else
                description[descriptionRes.data.name] = descriptionRes.data.effect_entries[1].short_effect;
        });
    return description;
}