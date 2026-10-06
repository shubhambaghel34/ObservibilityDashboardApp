import { useState } from 'react'
import './App.css'
import stats from './data/observability.json'

const chartWidth = 760
const chartHeight = 190
const navItems = ['Overview', 'Services', 'Traces', 'Alerts', 'Logs']

const maxValue = Math.max(...stats.timeSeries)
const minValue = Math.min(...stats.timeSeries)

const points = stats.timeSeries.map((value, index) => {
  const x = (index / (stats.timeSeries.length - 1)) * chartWidth
  const y = chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * (chartHeight - 24) - 12
  return { x, y, value }
})

const linePath = points
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
  .join(' ')

const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

function App() {
  const [activeTab, setActiveTab] = useState('Overview')

  const renderOverview = () => (
    <>
      <section className="metrics-grid">
        {stats.summary.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-header">
              <span>{metric.label}</span>
              <span className={`trend ${metric.status}`}>{metric.change}</span>
            </div>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel panel-large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Monitoring</p>
              <h3>Traffic & latency</h3>
            </div>
            <div className="segmented-control">
              <span className="segment active">1h</span>
              <span className="segment">6h</span>
              <span className="segment">24h</span>
            </div>
          </div>

          <svg className="chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(89, 185, 255, 0.4)" />
                <stop offset="100%" stopColor="rgba(89, 185, 255, 0.03)" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3].map((line) => (
              <line
                key={line}
                x1="0"
                x2={chartWidth}
                y1={24 + line * 42}
                y2={24 + line * 42}
                className="grid-line"
              />
            ))}

            <path d={areaPath} fill="url(#chartFill)" />
            <path d={linePath} className="line-path" />

            {points.map((point) => (
              <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="3.5" className="chart-point" />
            ))}
          </svg>

          <div className="chart-labels">
            {stats.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PromQL</p>
              <h3>Queries</h3>
            </div>
          </div>

          <div className="query-list">
            {stats.queries.map((query) => (
              <div key={query.label} className="query-item">
                <div className="query-meta">
                  <span className="query-name">{query.label}</span>
                  <span className="query-value">{query.value}</span>
                </div>
                <code>{query.query}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Service health</p>
              <h3>Dependencies</h3>
            </div>
          </div>

          <div className="service-list">
            {stats.services.map((service) => (
              <div key={service.name} className="service-row">
                <div className="service-name-block">
                  <span className={`status-dot ${service.status}`}></span>
                  <div>
                    <strong>{service.name}</strong>
                    <small>{service.uptime}</small>
                  </div>
                </div>

                <div className="mini-stat">
                  <span>Latency</span>
                  <strong>{service.latency}</strong>
                </div>
                <div className="mini-stat">
                  <span>Error</span>
                  <strong>{service.errorRate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Incidents</p>
              <h3>Active alerts</h3>
            </div>
          </div>

          <ul className="alert-list">
            {stats.alerts.map((alert) => (
              <li key={alert.title} className="alert-item">
                <div className={`alert-severity ${alert.severity}`}>{alert.severity}</div>
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel usecase-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Use cases</p>
            <h3>Where this dashboard helps</h3>
          </div>
        </div>

        <div className="usecase-grid">
          {stats.useCases.map((useCase) => (
            <article key={useCase.title} className={`usecase-card ${useCase.accent}`}>
              <span className="usecase-tag">{useCase.tag}</span>
              <h4>{useCase.title}</h4>
              <p>{useCase.description}</p>
              <strong>{useCase.metrics}</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  )

  const renderServices = () => (
    <div className="tab-panel">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Service health</p>
            <h3>Service catalog</h3>
          </div>
        </div>

        <div className="service-list">
          {stats.services.map((service) => (
            <div key={service.name} className="service-row">
              <div className="service-name-block">
                <span className={`status-dot ${service.status}`}></span>
                <div>
                  <strong>{service.name}</strong>
                  <small>{service.uptime}</small>
                </div>
              </div>

              <div className="mini-stat">
                <span>Latency</span>
                <strong>{service.latency}</strong>
              </div>
              <div className="mini-stat">
                <span>Error</span>
                <strong>{service.errorRate}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel kubectl-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Kubernetes</p>
            <h3>Pods and replicas</h3>
          </div>
          <a className="docs-link" href={stats.kubernetes.docsUrl} target="_blank" rel="noreferrer">
            Kubectl docs
          </a>
        </div>

        <div className="kubernetes-grid">
          <div>
            <h4>Pods</h4>
            <div className="kube-list">
              {stats.kubernetes.pods.map((pod) => (
                <div key={pod.name} className="kube-row">
                  <div>
                    <strong>{pod.name}</strong>
                    <small>{pod.namespace}</small>
                  </div>
                  <span className={`pill ${pod.status.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {pod.status}
                  </span>
                  <span>{pod.ready}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4>ReplicaSets</h4>
            <div className="kube-list">
              {stats.kubernetes.replicas.map((replica) => (
                <div key={replica.name} className="kube-row">
                  <div>
                    <strong>{replica.name}</strong>
                    <small>desired: {replica.desired}</small>
                  </div>
                  <span>{replica.ready}/{replica.desired}</span>
                  <span className="small-badge">ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kubectl-commands">
          <h4>Useful kubectl commands</h4>
          <ul>
            {stats.kubernetes.kubectl.map((item) => (
              <li key={item.command}>
                <code>{item.command}</code>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  const renderTraces = () => (
    <div className="tab-panel traces-panel">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Distributed tracing</p>
            <h3>Trace overview</h3>
          </div>
        </div>

        <div className="timeline">
          <div className="trace-row">
            <span>checkout-api</span>
            <div className="trace-bar"><i style={{ width: '72%' }} /></div>
            <strong>72ms</strong>
          </div>
          <div className="trace-row">
            <span>inventory-sync</span>
            <div className="trace-bar"><i style={{ width: '54%' }} /></div>
            <strong>54ms</strong>
          </div>
          <div className="trace-row">
            <span>billing-worker</span>
            <div className="trace-bar"><i style={{ width: '89%' }} /></div>
            <strong>89ms</strong>
          </div>
          <div className="trace-row">
            <span>edge-gateway</span>
            <div className="trace-bar"><i style={{ width: '38%' }} /></div>
            <strong>38ms</strong>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAlerts = () => (
    <div className="tab-panel">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Incident center</p>
            <h3>Alert policies</h3>
          </div>
        </div>
        <ul className="alert-list">
          {stats.alerts.map((alert) => (
            <li key={alert.title} className="alert-item">
              <div className={`alert-severity ${alert.severity}`}>{alert.severity}</div>
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="tab-panel">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Runtime logs</p>
            <h3>Recent events</h3>
          </div>
        </div>
        <div className="log-feed">
          <div className="log-line">
            <span className="log-time">09:44:11</span>
            <span className="log-level info">INFO</span>
            <span>gateway handled 184 requests with 0.08% errors</span>
          </div>
          <div className="log-line">
            <span className="log-time">09:42:08</span>
            <span className="log-level warn">WARN</span>
            <span>billing queue depth breached threshold on worker-4</span>
          </div>
          <div className="log-line">
            <span className="log-time">09:41:23</span>
            <span className="log-level error">ERROR</span>
            <span>inventory sync retry loop exceeded 3 attempts</span>
          </div>
          <div className="log-line">
            <span className="log-time">09:40:50</span>
            <span className="log-level info">INFO</span>
            <span>deploy completed successfully with 100% canary health</span>
          </div>
        </div>
      </div>
    </div>
  )

  const tabContent = {
    Overview: renderOverview(),
    Services: renderServices(),
    Traces: renderTraces(),
    Alerts: renderAlerts(),
    Logs: renderLogs(),
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Stack</p>
            <h1>SignalFlow</h1>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={() => setActiveTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Cluster</p>
          <strong>{stats.cluster}</strong>
          <span className="status-dot healthy"></span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Observability</p>
            <h2>{activeTab === 'Overview' ? stats.title : `${activeTab} overview`}</h2>
          </div>

          <div className="toolbar">
            <button className="chip">{stats.window}</button>
            <button className="primary-btn">Deploy</button>
          </div>
        </header>

        {tabContent[activeTab]}
      </main>
    </div>
  )
}

export default App
