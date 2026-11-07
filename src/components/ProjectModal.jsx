import React, { useEffect, useRef } from 'react';
import { 
  X, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  UploadCloud, 
  ShieldCheck, 
  Coins, 
  Search, 
  TrendingUp,
  Layers,
  Building2,
  UserCheck,
  Receipt,
  HeartPulse,
  Sliders,
  Bot,
  BarChart3,
  Video,
  LayoutDashboard,
  Workflow,
  ArrowRight
} from 'lucide-react';

// Feature icon helper
function getFeatureIcon(id) {
  switch (id) {
    // EduSure features
    case 'upload':
      return <UploadCloud size={18} />;
    case 'verification':
      return <ShieldCheck size={18} />;
    case 'rewards':
      return <Coins size={18} />;
    case 'discovery':
      return <Search size={18} />;
    case 'monetization':
      return <TrendingUp size={18} />;

    // OneHealth features
    case 'ai-guidance':
    case 'guidance':
      return <Sparkles size={18} />;
    case 'hospital-discovery':
    case 'hospital':
      return <Building2 size={18} />;
    case 'doctor-discovery':
    case 'doctor':
      return <UserCheck size={18} />;
    case 'cost-transparency':
    case 'cost':
      return <Receipt size={18} />;
    case 'treatment-packages':
    case 'packages':
      return <HeartPulse size={18} />;

    // QualifyAI features
    case 'config':
      return <Sliders size={18} />;
    case 'ai-interview':
      return <Bot size={18} />;
    case 'evaluation':
      return <BarChart3 size={18} />;
    case 'monitoring':
      return <Video size={18} />;
    case 'dashboard':
      return <LayoutDashboard size={18} />;

    // Portfolio features
    case 'navigation':
      return <Workflow size={18} />;
    case '3d-visuals':
      return <Layers size={18} />;
    case 'animations':
      return <Sparkles size={18} />;
    case 'theme-mode':
      return <Sliders size={18} />;
    case 'responsive':
      return <LayoutDashboard size={18} />;
    case 'interactive-sections':
      return <Building2 size={18} />;

    default:
      return <CheckCircle2 size={18} />;
  }
}

export default function ProjectModal({ project, isOpen, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Auto-focus close button or modal container
      const timer = setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
      }, 100);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const caseStudy = project.caseStudy;
  const isLink = Boolean(project.liveUrl);

  return (
    <div
      className="project-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="project-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="project-modal-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="project-modal-header">
          <div className="project-modal-badge-row">
            <span className="project-modal-badge">
              {caseStudy ? 'Case Study' : 'Project Details'}
            </span>
            {caseStudy?.projectType && (
              <span className="project-modal-category">
                {caseStudy.projectType}
              </span>
            )}
            {isLink && (
              <span className="project-modal-live-status">
                <span className="live-dot" /> Live Project
              </span>
            )}
          </div>
          <h2 id="project-modal-title" className="project-modal-title">
            {project.title}
          </h2>
          {caseStudy?.tagline && (
            <p className="project-modal-tagline">
              {caseStudy.tagline}
            </p>
          )}
          <p className="project-modal-overview">
            {caseStudy ? caseStudy.overview : project.description}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="project-modal-body">
          {caseStudy ? (
            <>
              {/* Problem Statement */}
              <section className="project-modal-section problem-section">
                <div className="section-title-wrap">
                  <span className="section-icon problem-icon">
                    <AlertCircle size={17} />
                  </span>
                  <h3>Problem Statement</h3>
                </div>
                <div className="section-card problem-card">
                  <p>{caseStudy.problemStatement}</p>
                  {caseStudy.problemPoints && caseStudy.problemPoints.length > 0 && (
                    <ul className="modal-bullet-list">
                      {caseStudy.problemPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  {caseStudy.problemConclusion && (
                    <p className="problem-conclusion">{caseStudy.problemConclusion}</p>
                  )}
                </div>
              </section>

              {/* Our Solution */}
              <section className="project-modal-section solution-section">
                <div className="section-title-wrap">
                  <span className="section-icon solution-icon">
                    <Sparkles size={17} />
                  </span>
                  <h3>Our Solution</h3>
                </div>
                <div className="section-card solution-card">
                  <p>{caseStudy.solution}</p>
                </div>
              </section>

              {/* How It Works (Workflow Pipeline) */}
              {caseStudy.workflow && caseStudy.workflow.length > 0 && (
                <section className="project-modal-section workflow-section">
                  <div className="section-title-wrap">
                    <span className="section-icon workflow-icon">
                      <Workflow size={17} />
                    </span>
                    <h3>How It Works</h3>
                  </div>
                  <div className="workflow-pipeline">
                    {caseStudy.workflow.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="workflow-step-card">
                          <div className="workflow-step-badge">Step {item.step}</div>
                          <h4 className="workflow-step-title">{item.title}</h4>
                          <p className="workflow-step-desc">{item.desc}</p>
                        </div>
                        {idx < caseStudy.workflow.length - 1 && (
                          <div className="workflow-connector" aria-hidden="true">
                            <ArrowRight size={14} className="workflow-arrow" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Features */}
              {caseStudy.features && caseStudy.features.length > 0 && (
                <section className="project-modal-section features-section">
                  <div className="section-title-wrap">
                    <span className="section-icon features-icon">
                      <Layers size={17} />
                    </span>
                    <h3>Key Features</h3>
                  </div>
                  <div className="features-list">
                    {caseStudy.features.map((feature, idx) => (
                      <div key={feature.id || idx} className="feature-item">
                        <div className="feature-item-header">
                          <span className="feature-item-icon">
                            {getFeatureIcon(feature.id)}
                          </span>
                          <span className="feature-item-number">
                            0{idx + 1}
                          </span>
                          <h4 className="feature-item-title">{feature.title}</h4>
                        </div>
                        {feature.description && (
                          <p className="feature-item-desc">{feature.description}</p>
                        )}
                        {feature.points && feature.points.length > 0 && (
                          <ul className="feature-points-list">
                            {feature.points.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits for Recruiters and Companies */}
              {caseStudy.benefits && caseStudy.benefits.length > 0 && (
                <section className="project-modal-section benefits-section">
                  <div className="section-title-wrap">
                    <span className="section-icon benefits-icon">
                      <CheckCircle2 size={17} />
                    </span>
                    <h3>Benefits for Recruiters & Companies</h3>
                  </div>
                  <div className="benefits-grid">
                    {caseStudy.benefits.map((benefit, idx) => (
                      <div key={idx} className="benefit-card">
                        <div className="benefit-card-header">
                          <span className="benefit-icon">
                            <CheckCircle2 size={16} />
                          </span>
                          <h4 className="benefit-title">{benefit.title}</h4>
                        </div>
                        <p className="benefit-desc">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="project-modal-simple-details">
              <div className="case-study-notice">
                <p>
                  Detailed case study, architecture breakdown, and problem statement
                  for <strong>{project.title}</strong> will be added in upcoming updates.
                </p>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {((project.technologies && project.technologies.length > 0) || (project.tags && project.tags.length > 0)) && (
            <section className="project-modal-section tech-section">
              <h4 className="tech-title">Technologies Used</h4>
              <div className="project-modal-tags">
                {(project.technologies || project.tags).map((tag, idx) => (
                  <span key={idx} className="project-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="project-modal-footer">
          <button
            type="button"
            className="project-modal-btn secondary-btn"
            onClick={onClose}
          >
            Close
          </button>

          {isLink && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal-btn primary-btn"
            >
              <span>View Live Project</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
