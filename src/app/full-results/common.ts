const COUNTRY_MAP = new Map<string, string>()
    .set('Bahrain', 'BH')
    .set('Saudi Arabia', 'SA')
    .set('Australia', 'AU')
    .set('Italy', 'IT')
    .set('United States', 'US')
    .set('Spain', 'ES')
    .set('Monaco', 'MC')
    .set('Azerbaijan', 'AZ')
    .set('Canada', 'CA')
    .set('UK', 'GB')
    .set('Austria', 'AT')
    .set('France', 'FR')
    .set('Hungary', 'HU')
    .set('Belgium', 'BE')
    .set('Netherlands', 'NL')
    .set('Russia', 'RU')
    .set('Singapore', 'SG')
    .set('Japan', 'JP')
    .set('USA', 'US')
    .set('Mexico', 'MX')
    .set('Brazil', 'BR')
    .set('UAE', 'AE');


export function getFlagLink(countryName: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${COUNTRY_MAP.get(countryName)}.svg`;
}