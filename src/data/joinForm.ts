/**
 * The join questionnaire.
 *
 * Design rule from the community research: the first question is never
 * “do you identify as a DoKAD?” — it is “was your parent or grandparent
 * adopted from Korea?”. Nobody is required to claim the label.
 */

export type Choice = { value: string; label: string; note?: string }

export const CONNECTION_CHOICES: Choice[] = [
  { value: 'mother', label: 'My mother is a Korean adoptee' },
  { value: 'father', label: 'My father is a Korean adoptee' },
  { value: 'both-parents', label: 'Both of my parents are Korean adoptees' },
  { value: 'grandparent', label: 'My grandparent is a Korean adoptee' },
  { value: 'other-ancestor', label: 'Another ancestor or family member is a Korean adoptee' },
  { value: 'adoptee', label: 'I am a Korean adoptee' },
  { value: 'partner-family', label: 'I am the partner or family member of a DoKAD' },
  { value: 'org', label: 'I work with an adoptee or DoKAD organization' },
  { value: 'researcher', label: 'I am a researcher or professional' },
  { value: 'figuring-out', label: 'I am curious and still figuring this out' },
  { value: 'something-else', label: 'Something else' },
  { value: 'no-answer', label: 'Prefer not to say' },
]

export const DESCRIPTION_CHOICES: Choice[] = [
  { value: 'child', label: 'Child of a Korean adoptee' },
  { value: 'grandchild', label: 'Grandchild of a Korean adoptee' },
  { value: 'other-descendant', label: 'Another descendant of a Korean adoptee' },
  { value: 'dokad', label: 'DoKAD' },
  { value: 'not-sure', label: 'I am not sure yet' },
  { value: 'supporter', label: 'I am here as a supporter' },
  { value: 'no-answer', label: 'Prefer not to say' },
]

export const INTEREST_CHOICES: Choice[] = [
  { value: 'casual-social', label: 'Casual social meetups' },
  { value: 'coffee', label: 'Coffee-shop gatherings' },
  { value: 'online-meetups', label: 'Online meetups' },
  { value: 'guided', label: 'Guided conversations' },
  { value: 'dokad-101', label: 'DoKAD 101 educational events' },
  { value: 'culture', label: 'Korean culture' },
  { value: 'language', label: 'Korean language' },
  { value: 'cooking', label: 'Korean cooking' },
  { value: 'korea-travel', label: 'Visiting Korea' },
  { value: 'family-history', label: 'Family history' },
  { value: 'genealogy', label: 'Birth-family and genealogy information' },
  { value: 'parent-story', label: 'Understanding a parent’s adoption story' },
  { value: 'preservation', label: 'File and photo preservation' },
  { value: 'research', label: 'Research about DoKAD experiences' },
  { value: 'intergenerational', label: 'Intergenerational conversations' },
  { value: 'creative', label: 'Creative workshops' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'volunteer', label: 'Volunteer opportunities' },
  { value: 'something-else', label: 'Something else' },
]

export const TIMING_CHOICES: Choice[] = [
  { value: 'wd-morning', label: 'Weekday mornings' },
  { value: 'wd-afternoon', label: 'Weekday afternoons' },
  { value: 'wd-evening', label: 'Weekday evenings' },
  { value: 'sat-morning', label: 'Saturday mornings' },
  { value: 'sat-afternoon', label: 'Saturday afternoons' },
  { value: 'sat-evening', label: 'Saturday evenings' },
  { value: 'sun-morning', label: 'Sunday mornings' },
  { value: 'sun-afternoon', label: 'Sunday afternoons' },
  { value: 'sun-evening', label: 'Sunday evenings' },
  { value: 'online-only', label: 'Online only' },
  { value: 'varies', label: 'My schedule varies' },
]

export const VENUE_CHOICES: Choice[] = [
  { value: 'coffee-shop', label: 'Coffee shop' },
  { value: 'library', label: 'Library' },
  { value: 'community-center', label: 'Community center' },
  { value: 'park', label: 'Park' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'university', label: 'University or school' },
  { value: 'online', label: 'Online' },
  { value: 'alcohol', label: 'Alcohol-serving venue' },
  { value: 'no-preference', label: 'No preference' },
  { value: 'other', label: 'Other' },
]

export const AGE_CHOICES: Choice[] = [
  { value: 'under-16', label: 'Under 16' },
  { value: '16-17', label: '16–17' },
  { value: '18-20', label: '18–20' },
  { value: '21-24', label: '21–24' },
  { value: '25-29', label: '25–29' },
  { value: '30-34', label: '30–34' },
  { value: '35-39', label: '35–39' },
  { value: '40-49', label: '40–49' },
  { value: '50-59', label: '50–59' },
  { value: '60-plus', label: '60+' },
  { value: 'no-answer', label: 'Prefer not to say' },
]

/** Age brackets that trigger the minors notice. */
export const MINOR_AGES = new Set(['under-16', '16-17'])

export const MINOR_NOTICE =
  'Because you told us you are under 18: we will not add you to public directories, research participation lists, or unrestricted community groups. Some events may ask for a parent or guardian to say yes first. You can ask us to delete everything you have sent at any time.'

export const PRIVACY_LINE =
  'Share only what feels comfortable. Most questions are optional, and your individual answers will never appear publicly.'

export const AGGREGATE_LINE =
  'Answers about interests, timing, and venues are used for planning in aggregate — to work out what to run and when, not to profile anyone.'
