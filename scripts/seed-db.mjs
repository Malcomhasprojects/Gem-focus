import { config } from 'dotenv'
import pg from 'pg'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: new URL('../.env.local', import.meta.url).pathname })

const WARDS = [
  'Central Gem',
  'East Gem',
  'North Gem',
  'South Gem',
  'West Gem',
  'Yala Township',
]

const issues = [
  {
    title: 'Broken water kiosk at Got Regea market',
    description:
      'The community water kiosk near Got Regea market has been leaking for three weeks. Women queue for hours and many families are buying untreated water from vendors. We need urgent repair or a temporary tank.',
    ward: 'Central Gem',
    station: 'Got Regea Primary',
    category: 'Water & sanitation',
    priority: 'high',
    status: 'in-progress',
    people_count: 48,
    reporter_name: 'Grace Akinyi',
    reporter_phone: '0712453891',
    admin_notes: 'Site visit done 4 Jul. Plumber engaged; parts ordered from Kisumu.',
    days_ago: 34,
  },
  {
    title: 'Yala–Sigomere road flooded after rains',
    description:
      'The murram section between Yala and Sigomere becomes impassable whenever it rains. Boda riders and school buses are getting stuck. Pupils from Nyandhe side miss classes for days.',
    ward: 'East Gem',
    station: 'Sigomere Secondary',
    category: 'Roads & transport',
    priority: 'high',
    status: 'pending',
    people_count: 120,
    reporter_name: 'James Ochieng',
    reporter_phone: '0721987456',
    admin_notes: null,
    days_ago: 12,
  },
  {
    title: 'Youth group needs vocational training space',
    description:
      'Over 60 unemployed youth in Ojola ward want tailoring and motorcycle repair training. The old chief\'s camp building is vacant but locked. Community leaders support converting it into a skills centre.',
    ward: 'North Gem',
    station: 'Ojola Primary',
    category: 'Youth & employment',
    priority: 'medium',
    status: 'in-progress',
    people_count: 63,
    reporter_name: 'Peter Odhiambo',
    reporter_phone: '0703129845',
    admin_notes: 'County skills fund application drafted with ward elders.',
    days_ago: 28,
  },
  {
    title: 'Usenge dispensary lacks maternity beds',
    description:
      'Pregnant mothers are referred to Yala Sub-County Hospital because Usenge dispensary has only one functional delivery bed. Two mothers delivered on benches last month.',
    ward: 'South Gem',
    station: 'Usenge Dispensary',
    category: 'Health services',
    priority: 'high',
    status: 'pending',
    people_count: 85,
    reporter_name: 'Mary Achieng',
    reporter_phone: '0734562109',
    admin_notes: null,
    days_ago: 8,
  },
  {
    title: 'Bursary list excludes day scholars',
    description:
      'Parents at Mbaga Secondary say bursary allocation favours boarding students. Day scholars from poor households travel long distances but receive no support.',
    ward: 'West Gem',
    station: 'Mbaga Secondary',
    category: 'Education & bursaries',
    priority: 'medium',
    status: 'resolved',
    people_count: 34,
    reporter_name: 'Joseph Otieno',
    reporter_phone: '0719876543',
    admin_notes: 'Met PTA 18 Jun. Agreed transparent scoring matrix for next cycle.',
    days_ago: 45,
  },
  {
    title: 'Fall armyworm destroying maize in Omia farms',
    description:
      'Farmers on the Omia irrigation scheme report heavy fall armyworm damage across 40 acres. Extension officers visited once but no subsidised pesticides arrived.',
    ward: 'Central Gem',
    station: 'Omia Irrigation Scheme',
    category: 'Agriculture',
    priority: 'high',
    status: 'in-progress',
    people_count: 52,
    reporter_name: 'David Ouma',
    reporter_phone: '0720345678',
    admin_notes: 'Coordinating with county agri office for emergency spraying.',
    days_ago: 6,
  },
  {
    title: 'Street lighting gaps near Yala bus park',
    description:
      'Traders and passengers at Yala bus park say muggings increase after 7pm because three solar street lights are not working. Market women fear closing late.',
    ward: 'Yala Township',
    station: 'Yala Bus Park',
    category: 'Security',
    priority: 'medium',
    status: 'pending',
    people_count: 41,
    reporter_name: 'Lucy Adhiambo',
    reporter_phone: '0708456123',
    admin_notes: null,
    days_ago: 15,
  },
  {
    title: 'Open drainage behind St. Mary\'s Yala',
    description:
      'An open storm drain behind St. Mary\'s Yala School smells badly and breeds mosquitoes. Children playing nearby have had repeated skin rashes.',
    ward: 'Yala Township',
    station: 'St. Mary\'s Yala',
    category: 'Water & sanitation',
    priority: 'medium',
    status: 'resolved',
    people_count: 27,
    reporter_name: 'Catherine Atieno',
    reporter_phone: '0711234567',
    admin_notes: 'Drain covered and desludged with youth volunteers on 22 Jun.',
    days_ago: 52,
  },
  {
    title: 'Nyamonye bridge handrails missing',
    description:
      'Pedestrians crossing Nyamonye stream use a narrow plank after handrails were washed away. Two elderly residents fell last week.',
    ward: 'East Gem',
    station: 'Nyamonye Market',
    category: 'Roads & transport',
    priority: 'high',
    status: 'in-progress',
    people_count: 19,
    reporter_name: 'Paul Omondi',
    reporter_phone: '0725678901',
    admin_notes: 'Timber rails installed temporarily; permanent works quoted.',
    days_ago: 21,
  },
  {
    title: 'Boda riders want designated stage at Ouko',
    description:
      'Boda boda operators at Ouko trading centre compete for space with vegetable vendors. They request a marked stage and shade structure.',
    ward: 'North Gem',
    station: 'Ouko Market',
    category: 'Other',
    priority: 'low',
    status: 'pending',
    people_count: 22,
    reporter_name: 'Kevin Owino',
    reporter_phone: '0706789012',
    admin_notes: null,
    days_ago: 18,
  },
  {
    title: 'Delayed NHIF reimbursements at Yala health centre',
    description:
      'Patients with NHIF cards wait weeks for approval at Yala health centre. Staff say the system is slow and some families pay cash they cannot afford.',
    ward: 'Yala Township',
    station: 'Yala Health Centre',
    category: 'Health services',
    priority: 'medium',
    status: 'pending',
    people_count: 56,
    reporter_name: 'Ruth Anyango',
    reporter_phone: '0732890145',
    admin_notes: null,
    days_ago: 10,
  },
  {
    title: 'Erosion threatening homes along River Yala',
    description:
      'Three homesteads near the River Yala bank in West Gem are losing land each rainy season. Residents want gabions or relocation support.',
    ward: 'West Gem',
    station: 'Nyandhe Beach',
    category: 'Other',
    priority: 'high',
    status: 'pending',
    people_count: 14,
    reporter_name: 'George Oloo',
    reporter_phone: '0714567890',
    admin_notes: null,
    days_ago: 25,
  },
  {
    title: 'School feeding programme irregular at Got Regea',
    description:
      'Got Regea Primary parents say lunch is served only twice a week despite county pledges. Attendance drops on days without meals.',
    ward: 'Central Gem',
    station: 'Got Regea Primary',
    category: 'Education & bursaries',
    priority: 'medium',
    status: 'in-progress',
    people_count: 38,
    reporter_name: 'Hellen Awuor',
    reporter_phone: '0723456789',
    admin_notes: 'Following up with county education office on supplier contract.',
    days_ago: 14,
  },
  {
    title: 'Fish landing site lacks cold storage',
    description:
      'Fisherfolk at Usenge beach lose income when Nile perch spoils before reaching Kisumu market. A shared cold room was promised two years ago.',
    ward: 'South Gem',
    station: 'Usenge Beach',
    category: 'Agriculture',
    priority: 'medium',
    status: 'pending',
    people_count: 31,
    reporter_name: 'Tom Ojwang',
    reporter_phone: '0709123456',
    admin_notes: null,
    days_ago: 30,
  },
  {
    title: 'Chief\'s office hours too limited',
    description:
      'Residents of South Gem say the assistant chief is only available one morning per week. ID applications and land dispute letters are delayed.',
    ward: 'South Gem',
    station: 'South Gem Chief\'s Camp',
    category: 'Other',
    priority: 'low',
    status: 'resolved',
    people_count: 18,
    reporter_name: 'Alice Aoko',
    reporter_phone: '0716789012',
    admin_notes: 'Raised with sub-county commissioner; hours extended to 3 days.',
    days_ago: 60,
  },
  {
    title: 'Potholes on Mbaga–Ragengni road',
    description:
      'The main access road to Mbaga market has deep potholes damaging vehicles and slowing ambulance response. Traders want grading before the market day.',
    ward: 'West Gem',
    station: 'Mbaga Market',
    category: 'Roads & transport',
    priority: 'medium',
    status: 'resolved',
    people_count: 44,
    reporter_name: 'Samson Onyango',
    reporter_phone: '0727890123',
    admin_notes: 'Grading completed 1 Jul with local contractor.',
    days_ago: 40,
  },
  {
    title: 'Youth football pitch waterlogged',
    description:
      'The community pitch at East Gem ward centre stays waterlogged after rain because drainage was never finished. Weekend tournaments cancelled.',
    ward: 'East Gem',
    station: 'East Gem Ward Centre',
    category: 'Youth & employment',
    priority: 'low',
    status: 'pending',
    people_count: 29,
    reporter_name: 'Brian Oduor',
    reporter_phone: '0705345678',
    admin_notes: null,
    days_ago: 7,
  },
  {
    title: 'Illegal sand harvesting near Ojola',
    description:
      'Trucks harvest sand at night along Ojola stream, widening the channel and threatening nearby farms. Residents want enforcement patrols.',
    ward: 'North Gem',
    station: 'Ojola Stream',
    category: 'Security',
    priority: 'high',
    status: 'in-progress',
    people_count: 36,
    reporter_name: 'Fredrick Okoth',
    reporter_phone: '0736012345',
    admin_notes: 'Reported to county environment officer; monitoring ongoing.',
    days_ago: 16,
  },
  {
    title: 'Maternity waiting shelter needs renovation',
    description:
      'Expectant mothers at Sigomere health facility sleep on broken benches in the waiting shelter. The roof leaks during storms.',
    ward: 'East Gem',
    station: 'Sigomere Health Centre',
    category: 'Health services',
    priority: 'medium',
    status: 'in-progress',
    people_count: 23,
    reporter_name: 'Dorothy Adhiambo',
    reporter_phone: '0718901234',
    admin_notes: 'CBO pledged roofing sheets; labour mobilised.',
    days_ago: 22,
  },
  {
    title: 'Cattle dip unused for lack of chemicals',
    description:
      'The communal cattle dip at Central Gem has not operated since January because acaricide stock ran out. Livestock diseases are rising.',
    ward: 'Central Gem',
    station: 'Central Gem Cattle Dip',
    category: 'Agriculture',
    priority: 'medium',
    status: 'pending',
    people_count: 47,
    reporter_name: 'Stephen Ochieng',
    reporter_phone: '0720123987',
    admin_notes: null,
    days_ago: 19,
  },
  {
    title: 'PWD access ramp missing at Yala county offices',
    description:
      'Persons with disabilities cannot access Yala county service point without assistance. There is no ramp and the lift is always locked.',
    ward: 'Yala Township',
    station: 'Yala County Offices',
    category: 'Other',
    priority: 'medium',
    status: 'pending',
    people_count: 11,
    reporter_name: 'Jane Akoth',
    reporter_phone: '0707234561',
    admin_notes: null,
    days_ago: 11,
  },
  {
    title: 'Street children gathering at Yala market',
    description:
      'A growing group of street-connected children sleep near Yala market stores. Traders want a rescue centre referral and night patrol coordination.',
    ward: 'Yala Township',
    station: 'Yala Market',
    category: 'Youth & employment',
    priority: 'high',
    status: 'in-progress',
    people_count: 15,
    reporter_name: 'Pastor Michael Ouma',
    reporter_phone: '0713345678',
    admin_notes: 'Linked with children\'s officer; intake assessment scheduled.',
    days_ago: 9,
  },
  {
    title: 'Broken borehole pump at Nyandhe',
    description:
      'The Nyandhe community borehole pump failed in May. Residents walk 2 km to the next safe source. Repair estimate is KSh 85,000.',
    ward: 'West Gem',
    station: 'Nyandhe Primary',
    category: 'Water & sanitation',
    priority: 'high',
    status: 'resolved',
    people_count: 72,
    reporter_name: 'Elizabeth Achieng',
    reporter_phone: '0724567891',
    admin_notes: 'Pump repaired with ward emergency fund on 28 Jun.',
    days_ago: 38,
  },
  {
    title: 'Teachers\' houses dilapidated at Ouko Primary',
    description:
      'Two teacher houses at Ouko Primary have leaking roofs. Staff threaten transfer requests which would hurt pupil performance.',
    ward: 'North Gem',
    station: 'Ouko Primary',
    category: 'Education & bursaries',
    priority: 'low',
    status: 'pending',
    people_count: 9,
    reporter_name: 'Head Teacher Ben Owiti',
    reporter_phone: '0701567890',
    admin_notes: null,
    days_ago: 33,
  },
  {
    title: 'Market fees increased without consultation',
    description:
      'Traders at Central Gem market say stall fees rose 40% without public participation. Small-scale vegetable sellers may be pushed out.',
    ward: 'Central Gem',
    station: 'Central Gem Market',
    category: 'Other',
    priority: 'medium',
    status: 'pending',
    people_count: 26,
    reporter_name: 'Mercy Atieno',
    reporter_phone: '0737123456',
    admin_notes: null,
    days_ago: 5,
  },
  {
    title: 'Ambulance delay from South Gem',
    description:
      'A sick child waited over two hours for ambulance transfer to Siaya Referral. Poor road and single ambulance coverage cited.',
    ward: 'South Gem',
    station: 'South Gem Dispensary',
    category: 'Health services',
    priority: 'high',
    status: 'pending',
    people_count: 8,
    reporter_name: 'Anonymous',
    reporter_phone: null,
    admin_notes: null,
    days_ago: 3,
  },
  {
    title: 'Sugarcane payments delayed for outgrowers',
    description:
      'Outgrowers supplying a private mill near Gem complain of three-month payment delays. Families cannot pay school fees.',
    ward: 'West Gem',
    station: 'Gem Outgrowers Office',
    category: 'Agriculture',
    priority: 'medium',
    status: 'in-progress',
    people_count: 58,
    reporter_name: 'Charles Omondi',
    reporter_phone: '0712456012',
    admin_notes: 'Escalated to agriculture CEC; mill meeting set for 18 Jul.',
    days_ago: 17,
  },
  {
    title: 'Alcohol dens near North Gem secondary school',
    description:
      'Parents report illegal chang\'aa dens operating 200 metres from North Gem Secondary. Students skip evening preps.',
    ward: 'North Gem',
    station: 'North Gem Secondary',
    category: 'Security',
    priority: 'high',
    status: 'in-progress',
    people_count: 42,
    reporter_name: 'Parents Association',
    reporter_phone: '0723012456',
    admin_notes: 'Joint patrol with chiefs planned; two dens flagged.',
    days_ago: 13,
  },
]

const events = [
  {
    title: 'Gem listening forum — water & roads',
    ward: 'Central Gem',
    venue: 'Got Regea Social Hall',
    event_date: '2026-05-24',
    event_time: '10:00:00',
    objective:
      'Collect ward-specific priorities on water access and feeder roads ahead of the county supplementary budget.',
    status: 'completed',
    attendance: 186,
    expected_attendance: 200,
    days_ago: 50,
  },
  {
    title: 'Youth employment roundtable',
    ward: 'North Gem',
    venue: 'Ojola Chief\'s Camp',
    event_date: '2026-06-07',
    event_time: '14:00:00',
    objective:
      'Engage boda boda SACCOs, tailoring groups, and county skills officers on vocational centre proposal.',
    status: 'completed',
    attendance: 94,
    expected_attendance: 120,
    days_ago: 36,
  },
  {
    title: 'Mama Gem health outreach',
    ward: 'South Gem',
    venue: 'Usenge Dispensary grounds',
    event_date: '2026-06-14',
    event_time: '09:00:00',
    objective:
      'Free screening for expectant mothers and discussion on maternity bed shortages at Usenge.',
    status: 'completed',
    attendance: 142,
    expected_attendance: 150,
    days_ago: 29,
  },
  {
    title: 'Education & bursary town hall',
    ward: 'West Gem',
    venue: 'Mbaga Secondary assembly hall',
    event_date: '2026-06-18',
    event_time: '11:00:00',
    objective:
      'Publish transparent bursary scoring criteria and hear from day scholars and PTA representatives.',
    status: 'completed',
    attendance: 210,
    expected_attendance: 180,
    days_ago: 25,
  },
  {
    title: 'Yala traders breakfast meeting',
    ward: 'Yala Township',
    venue: 'Yala Market stores veranda',
    event_date: '2026-06-28',
    event_time: '08:00:00',
    objective:
      'Address market fees, security after dark, and street lighting around the bus park.',
    status: 'completed',
    attendance: 78,
    expected_attendance: 100,
    days_ago: 15,
  },
  {
    title: 'Farmers\' field day — pest control',
    ward: 'Central Gem',
    venue: 'Omia Irrigation Scheme demo plot',
    event_date: '2026-07-05',
    event_time: '10:30:00',
    objective:
      'Demonstrate fall armyworm control and coordinate emergency pesticide access with extension officers.',
    status: 'completed',
    attendance: 115,
    expected_attendance: 130,
    days_ago: 8,
  },
  {
    title: 'East Gem infrastructure walkabout',
    ward: 'East Gem',
    venue: 'Sigomere to Nyamonye road corridor',
    event_date: '2026-07-08',
    event_time: '07:30:00',
    objective:
      'Site visit with residents to assess flooded road sections and Nyamonye bridge safety.',
    status: 'completed',
    attendance: 52,
    expected_attendance: 60,
    days_ago: 5,
  },
  {
    title: 'Security & community policing forum',
    ward: 'North Gem',
    venue: 'Ouko Primary multipurpose hall',
    event_date: '2026-07-11',
    event_time: '16:00:00',
    objective:
      'Discuss sand harvesting enforcement, alcohol dens near schools, and village patrol coordination.',
    status: 'completed',
    attendance: 88,
    expected_attendance: 90,
    days_ago: 2,
  },
  {
    title: 'Women leaders strategy session',
    ward: 'Yala Township',
    venue: 'St. Mary\'s Yala conference room',
    event_date: '2026-07-18',
    event_time: '10:00:00',
    objective:
      'Plan ward-level mobilisation on health access, market trader rights, and nominee support structures.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 75,
    days_ahead: 5,
  },
  {
    title: 'West Gem riverbank erosion consultative',
    ward: 'West Gem',
    venue: 'Nyandhe Beach community centre',
    event_date: '2026-07-20',
    event_time: '11:00:00',
    objective:
      'Hear from families affected by River Yala erosion and present gabion options with engineers.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 65,
    days_ahead: 7,
  },
  {
    title: 'South Gem fish value-chain meeting',
    ward: 'South Gem',
    venue: 'Usenge Beach landing site',
    event_date: '2026-07-22',
    event_time: '09:30:00',
    objective:
      'Unite beach management units on cold storage needs and fair market transport costs.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 110,
    days_ahead: 9,
  },
  {
    title: 'Gem constituency manifesto launch',
    ward: 'Central Gem',
    venue: 'Yala Stadium',
    event_date: '2026-07-26',
    event_time: '13:00:00',
    objective:
      'Public launch of the five-year Gem development agenda covering health, roads, youth, and agriculture.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 2500,
    days_ahead: 13,
  },
  {
    title: 'Ward elder coordination breakfast',
    ward: 'East Gem',
    venue: 'East Gem Ward Centre',
    event_date: '2026-08-02',
    event_time: '08:30:00',
    objective:
      'Align elder forums on issue reporting, event mobilisation, and peaceful campaign conduct.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 45,
    days_ahead: 20,
  },
  {
    title: 'Cancelled: night rally at Yala bus park',
    ward: 'Yala Township',
    venue: 'Yala Bus Park',
    event_date: '2026-06-22',
    event_time: '19:00:00',
    objective:
      'Evening rally on urban security — rescheduled due to heavy rains and safety concerns.',
    status: 'cancelled',
    attendance: null,
    expected_attendance: 300,
    days_ago: 21,
  },
]

const metrics = [
  { metric_key: 'ward_visits', metric_value: 18 },
  { metric_key: 'listening_sessions', metric_value: 12 },
  { metric_key: 'issues_actioned', metric_value: 11 },
  { metric_key: 'volunteer_recruits', metric_value: 156 },
]

function daysAgoDate(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function daysAheadDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

try {
  const existing = await pool.query('SELECT COUNT(*)::int AS count FROM issues')
  if (existing.rows[0].count > 0) {
    console.log(`Database already has ${existing.rows[0].count} issues. Skipping seed.`)
    console.log('Run with --force to replace existing data.')
    if (!process.argv.includes('--force')) {
      process.exit(0)
    }
    await pool.query('TRUNCATE issues, campaign_events, campaign_metrics RESTART IDENTITY CASCADE')
    console.log('Cleared existing data.')
  }

  for (const issue of issues) {
    const createdAt = daysAgoDate(issue.days_ago)
    const updatedAt = issue.status === 'pending' ? createdAt : daysAgoDate(Math.max(1, issue.days_ago - 3))
    await pool.query(
      `INSERT INTO issues (
        title, description, ward, station, category, priority, status,
        people_count, reporter_name, reporter_phone, admin_notes, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        issue.title,
        issue.description,
        issue.ward,
        issue.station,
        issue.category,
        issue.priority,
        issue.status,
        issue.people_count,
        issue.reporter_name,
        issue.reporter_phone,
        issue.admin_notes,
        createdAt,
        updatedAt,
      ],
    )
  }

  for (const event of events) {
    const eventDate =
      event.days_ahead != null
        ? daysAheadDate(event.days_ahead)
        : daysAgoDate(event.days_ago).toISOString().slice(0, 10)
    const createdAt =
      event.days_ahead != null ? daysAgoDate(14) : daysAgoDate(event.days_ago + 10)
    const updatedAt =
      event.status === 'completed'
        ? daysAgoDate(Math.max(1, (event.days_ago ?? 0) - 1))
        : createdAt

    await pool.query(
      `INSERT INTO campaign_events (
        title, ward, venue, event_date, event_time, objective, status,
        attendance, expected_attendance, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        event.title,
        event.ward,
        event.venue,
        eventDate,
        event.event_time,
        event.objective,
        event.status,
        event.attendance,
        event.expected_attendance,
        createdAt,
        updatedAt,
      ],
    )
  }

  for (const metric of metrics) {
    await pool.query(
      `INSERT INTO campaign_metrics (metric_key, metric_value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (metric_key) DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = NOW()`,
      [metric.metric_key, metric.metric_value],
    )
  }

  const summary = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM issues) AS issues,
      (SELECT COALESCE(SUM(people_count), 0)::int FROM issues) AS people,
      (SELECT COUNT(*)::int FROM campaign_events) AS events,
      (SELECT COUNT(*)::int FROM campaign_metrics) AS metrics
  `)

  const s = summary.rows[0]
  console.log('Seed complete.')
  console.log(`  ${s.issues} issues (${s.people} people represented)`)
  console.log(`  ${s.events} campaign events`)
  console.log(`  ${s.metrics} campaign metrics`)
  console.log(`  Wards covered: ${WARDS.length}`)
} finally {
  await pool.end()
}
