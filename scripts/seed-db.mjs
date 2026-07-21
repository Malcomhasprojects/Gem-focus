import { config } from 'dotenv'
import mysql from 'mysql2/promise'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env.local') })

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'gem_focus',
  }
}

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
]

const events = [
  {
    title: 'Gem listening forum — water & roads',
    ward: 'Central Gem',
    venue: 'Got Regea Social Hall',
    event_date: '2026-05-24',
    event_time: '10:00:00',
    objective: 'Collect ward-specific priorities on water access and feeder roads ahead of the county supplementary budget.',
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
    objective: 'Engage boda boda SACCOs, tailoring groups, and county skills officers on vocational centre proposal.',
    status: 'completed',
    attendance: 94,
    expected_attendance: 120,
    days_ago: 36,
  },
  {
    title: 'Gem constituency manifesto launch',
    ward: 'Central Gem',
    venue: 'Yala Stadium',
    event_date: '2026-07-26',
    event_time: '13:00:00',
    objective: 'Public launch of the five-year Gem development agenda covering health, roads, youth, and agriculture.',
    status: 'scheduled',
    attendance: null,
    expected_attendance: 2500,
    days_ahead: 13,
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

const connection = await mysql.createConnection(getPoolConfig())

try {
  const [existing] = await connection.query('SELECT COUNT(*) AS count FROM issues')
  const count = existing[0].count
  if (count > 0) {
    console.log(`Database already has ${count} issues. Skipping seed.`)
    console.log('Run with --force to replace existing data.')
    if (!process.argv.includes('--force')) {
      process.exit(0)
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 0')
    await connection.query('TRUNCATE TABLE issues')
    await connection.query('TRUNCATE TABLE campaign_events')
    await connection.query('TRUNCATE TABLE campaign_metrics')
    await connection.query('SET FOREIGN_KEY_CHECKS = 1')
    console.log('Cleared existing data.')
  }

  for (const issue of issues) {
    const createdAt = daysAgoDate(issue.days_ago)
    const updatedAt = issue.status === 'pending' ? createdAt : daysAgoDate(Math.max(1, issue.days_ago - 3))
    await connection.query(
      `INSERT INTO issues (
        title, description, ward, station, category, priority, status,
        people_count, reporter_name, reporter_phone, admin_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    await connection.query(
      `INSERT INTO campaign_events (
        title, ward, venue, event_date, event_time, objective, status,
        attendance, expected_attendance, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    await connection.query(
      `INSERT INTO campaign_metrics (metric_key, metric_value, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value), updated_at = NOW()`,
      [metric.metric_key, metric.metric_value],
    )
  }

  const [summary] = await connection.query(`
    SELECT
      (SELECT COUNT(*) FROM issues) AS issues,
      (SELECT COALESCE(SUM(people_count), 0) FROM issues) AS people,
      (SELECT COUNT(*) FROM campaign_events) AS events,
      (SELECT COUNT(*) FROM campaign_metrics) AS metrics
  `)

  const s = summary[0]
  console.log('Seed complete.')
  console.log(`  ${s.issues} issues (${s.people} people represented)`)
  console.log(`  ${s.events} campaign events`)
  console.log(`  ${s.metrics} campaign metrics`)
  console.log(`  Wards covered: ${WARDS.length}`)
} finally {
  await connection.end()
}
