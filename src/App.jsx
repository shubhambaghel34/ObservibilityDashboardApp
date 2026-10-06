import './App.css'
import stats from './data/observability.json'

const chartWidth = 760
const chartHeight = 190
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
          <button className="nav-item active">Overview</button>
          <button className="nav-item">Services</button>
          <button className="nav-item">Traces</button>
          <button className="nav-item">Alerts</button>
          <button className="nav-item">Logs</button>
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
            <h2>{stats.title}</h2>
          </div>

          <div className="toolbar">
            <button className="chip">{stats.window}</button>
            <button className="primary-btn">Deploy</button>
          </div>
        </header>

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
      </main>
    </div>
  )
}

export default App
