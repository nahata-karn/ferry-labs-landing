export const BOOKING_URL =
  'https://calendar.app.google/t69X39w3jLLAKn3L7';

export const CASE_STUDIES = [
  {
    slug: 'energy-transmission',
    number: '01',
    title: 'Scaling a $4B project portfolio without scaling senior headcount.',
    image: 'assets/case-studies/transmission-infrastructure.png',
    imageAlt:
      'A pixel-art transmission network stretches across a mountainous blue landscape.',
    company: [
      'An energy transmission developer operating across six TSOs, with a lean team of senior experts responsible for winning and delivering complex infrastructure projects.'
    ],
    problem: {
      paragraphs: [
        'Winning a major transmission project requires the company to bring together engineering, routing, cost, schedule, permitting, commercial risk, and prior-experience evidence.',
        'A submission can exceed 300 pages, with critical information distributed across Microsoft Word, Excel, Smartsheet, Primavera P6, Microsoft Project, GIS, engineering models, schedules, studies, attachments, and historical projects.',
        'Senior operators must manually:'
      ],
      bullets: [
        'Find and validate evidence from previous projects',
        'Reconcile conflicting facts across workstreams',
        'Translate technical decisions into a competitive argument',
        'Keep costs, dates, routes, and claims consistent throughout the submission',
        'Review every output for accuracy and strategic strength'
      ],
      closing:
        'The limiting factor is not market opportunity. It is the amount of senior expertise required to pursue each opportunity.'
    },
    platform: {
      intro:
        'Ferry is deploying a private intelligence system inside the company’s environment. The platform includes:',
      bullets: [
        'A context layer connecting project data, documents, decisions, and prior experience',
        'Agents that research, synthesize evidence, and execute critical bid workflows',
        'Custom evaluations tuned to the company’s standards, knowledge, and expert judgment',
        'A learning loop that turns expert corrections into better performance on every project'
      ]
    },
    workflow: [
      {
        icon: 'source',
        label:
          'A context layer connecting project data, documents, decisions, and prior experience'
      },
      {
        icon: 'research',
        label:
          'Agents that research, synthesize evidence, and execute critical bid workflows'
      },
      {
        icon: 'evaluation',
        label:
          'Custom evaluations tuned to the company’s standards, knowledge, and expert judgment'
      },
      {
        icon: 'learning',
        label:
          'A learning loop that turns expert corrections into better performance on every project'
      }
    ],
    impact: [
      '10x less senior operator time per bid, enabling the existing team to pursue more opportunities',
      '$XXXM in estimated additional revenue from increased bid capacity and improved win conversion'
    ]
  },
  {
    slug: 'spacecraft-engineering',
    number: '02',
    title: 'Making spacecraft engineering move at production speed.',
    image: 'assets/case-studies/spacecraft-engineering.png',
    imageAlt:
      'A pixel-art spacecraft stands beside a snow-covered mountain beneath a blue sky.',
    company: [
      'A $2.3B satellite-platform manufacturer building configurable spacecraft for commercial and national-security missions.',
      'The company is bringing a productized manufacturing model to an industry traditionally dominated by slow, bespoke engineering programs.'
    ],
    problem: {
      paragraphs: [
        'Every spacecraft must fit propulsion, avionics, power, payloads, and deployable structures within strict launch-defined constraints for mass, volume, stiffness, and mechanical interfaces.',
        'The engineering workflow spans CAD and finite-element analysis tools, component libraries, parts lists, vendor specifications, simulation outputs, and physical test results.',
        'When a component becomes unavailable, a vibration test fails, or the launch envelope changes, engineers must manually:'
      ],
      bullets: [
        'Identify every part of the design affected by the change',
        'Reconfigure components within the available volume',
        'Redesign structural panels and mechanical interfaces',
        'Update the underlying CAD geometry',
        'Re-run structural analysis and validate the revised design',
        'Preserve design intent across iterations'
      ],
      closing:
        'The initial design is not the bottleneck. The limiting factor is repeatedly bringing the spacecraft back to a valid design as requirements and physical constraints change.'
    },
    platform: {
      intro:
        'Ferry is developing an engineering intelligence system that works across the company’s existing design and analysis tools. The platform includes:',
      bullets: [
        'A context layer connecting requirements, components, geometry, constraints, and test results',
        'Agents that generate geometry, propagate changes, and execute redesign workflows',
        'Custom evaluations tuned to the company’s engineering standards, design rules, and mission constraints',
        'A learning loop that incorporates engineering review, simulation, and physical testing into future iterations'
      ]
    },
    workflow: [
      {
        icon: 'source',
        label:
          'A context layer connecting requirements, components, geometry, constraints, and test results'
      },
      {
        icon: 'geometry',
        label:
          'Agents that generate geometry, propagate changes, and execute redesign workflows'
      },
      {
        icon: 'evaluation',
        label:
          'Custom evaluations tuned to the company’s engineering standards, design rules, and mission constraints'
      },
      {
        icon: 'learning',
        label:
          'A learning loop that incorporates engineering review, simulation, and physical testing into future iterations'
      }
    ],
    impact: [
      'Compress the design-test-redesign cycle, reducing the expert time required to produce a validated iteration',
      'Increase engineering and production throughput, enabling the same team to support more spacecraft and missions'
    ]
  }
];
