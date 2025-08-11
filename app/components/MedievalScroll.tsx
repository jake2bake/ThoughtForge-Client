import { useState, useEffect } from "react";

interface Topic {
  id: number;
  label: string;
}

interface User {
  id: number;
  username: string;
}

interface Entry {
  id: number;
  title: string;
  reflection: string;
  isPrivate: boolean;
  created_at: string;
  topic: Topic | null;
  user: User | null;
}

// Updated component props to include currentUser
export default function MedievalScroll({ 
  entry, 
  onEdit, 
  onDelete,
  currentUser 
}: { 
  entry: Entry; 
  onEdit: () => void; 
  onDelete: () => void;
  currentUser: User | null; // Add currentUser prop
}) {
  const [isUnfurling, setIsUnfurling] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Check if current user is the author of the entry
  const isAuthor = currentUser && entry.user && currentUser.id === entry.user.id;

  // Format the date in medieval style
  const formatMedievalDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const getDayOrdinal = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `The ${day}${getDayOrdinal(day)} day of ${month}, in the year of our code ${year}`;
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    onDelete()
  }

  const handleDeleteCancel = () => {
  setShowDeleteConfirm(false);
};

  // Unfurling animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnfurling(false);
      setShowContent(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for content
  useEffect(() => {
    if (showContent && currentIndex < entry.reflection.length) {
      const timer = setTimeout(() => {
        setTypewriterText(prev => prev + entry.reflection[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 25);

      return () => clearTimeout(timer);
    }
  }, [showContent, currentIndex, entry.reflection]);

  

  return (
    <>
      <div className="scroll-container">
        {/* Action Buttons - Only show if user is the author */}
        {isAuthor && (
          <div className="medieval-actions">
            <button 
              onClick={onEdit}
              className="medieval-btn medieval-btn-edit"
              title="Edit this scroll"
            >
              <span className="btn-icon">✍️</span>
              <span className="btn-text">Amend</span>
            </button>
            <button 
              onClick={handleDeleteClick}
              className="medieval-btn medieval-btn-delete"
              title="Destroy this scroll"
            >
              <span className="btn-icon">🔥</span>
              <span className="btn-text">Burn</span>
            </button>
          </div>
        )}

{/* Delete Confirmation Modal */}
{showDeleteConfirm && (
  <div className="modal-overlay">
    <div className="delete-confirmation">
      <div className="confirmation-header">
        <span className="warning-icon">⚠️</span>
        <h3>By Royal Decree</h3>
      </div>
      <div className="confirmation-content">
        <p>Art thou certain thou wishest to consign this sacred scroll to the flames? 
        This action cannot be undone, and the wisdom contained within shall be lost forever.</p>
        <div className="scroll-preview">
          <strong>"{entry.title}"</strong>
        </div>
      </div>
      <div className="confirmation-actions">
        <button 
          onClick={handleDeleteCancel}
          className="medieval-btn medieval-btn-cancel"
        >
          <span className="btn-icon">🛡️</span>
          <span className="btn-text">Preserve</span>
        </button>
        <button 
          onClick={handleDeleteConfirm}
          className="medieval-btn medieval-btn-confirm-delete"
        >
          <span className="btn-icon">🔥</span>
          <span className="btn-text">Burn It</span>
        </button>
      </div>
    </div>
  </div>
)}
        {/* Wax Seal */}
        <div className="wax-seal">
          <div className="seal-inner">
            {entry.isPrivate ? '🔒' : '📜'}
          </div>
        </div>

        {/* Main Scroll */}
        <div className={`ancient-scroll ${isUnfurling ? 'unfurling' : 'unfurled'}`}>
          {/* Scroll Shadow */}
          <div className="scroll-shadow"></div>
          
          {/* Top Rod */}
          <div className="scroll-rod scroll-rod-top">
            <div className="rod-end rod-end-left"></div>
            <div className="rod-body"></div>
            <div className="rod-end rod-end-right"></div>
            <div className="ribbon ribbon-left">🎀</div>
            <div className="ribbon ribbon-right">🎀</div>
          </div>

          {/* Parchment Body */}
          <div className="scroll-parchment">
            {/* Decorative Header Border */}
            <div className="decorative-border-top">
              ⚜️═══════════════════════════════════════════════════════════════════⚜️
            </div>

            {/* Entry Header */}
            <div className="entry-header">
              <h1 className="illuminated-title">
                <span className="drop-cap">{entry.title.charAt(0)}</span>
                {entry.title.slice(1)}
              </h1>
              
              <div className="entry-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span className="meta-text">Inscribed upon: {formatMedievalDate(entry.created_at)}</span>
                </div>
                {entry.user && (
                  <div className="meta-item">
                    <span className="meta-icon">✍️</span>
                    <span className="meta-text">By the hand of: Sir {entry.user.username}</span>
                  </div>
                )}
                {entry.topic && (
                  <div className="meta-item">
                    <span className="meta-icon">🏷️</span>
                    <span className="meta-text">Subject of contemplation: {entry.topic.label}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-icon">{entry.isPrivate ? '🔒' : '🌍'}</span>
                  <span className="meta-text">
                    {entry.isPrivate ? 'Private thoughts, sealed from prying eyes' : 'Open for all to witness'}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Separator */}
            <div className="decorative-separator">
              ❦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━❦
            </div>

            {/* Main Content */}
            <div className="scroll-content">
              <div className="content-text">
                {showContent && (
                  <span className="typewriter-text">
                    {typewriterText}
                    {currentIndex < entry.reflection.length && (
                      <span className="quill-cursor">|</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Decorative Footer */}
            <div className="decorative-border-bottom">
              ⚜️═══════════════════════════════════════════════════════════════════⚜️
            </div>

            {/* Ink Blots and Age Marks */}
            <div className="age-mark age-mark-1">•</div>
            <div className="age-mark age-mark-2">∘</div>
            <div className="age-mark age-mark-3">°</div>
            <div className="ink-blot ink-blot-1"></div>
            <div className="ink-blot ink-blot-2"></div>
            <div className="burn-mark burn-mark-1"></div>
            <div className="burn-mark burn-mark-2"></div>
          </div>

          {/* Bottom Rod */}
          <div className="scroll-rod scroll-rod-bottom">
            <div className="rod-end rod-end-left"></div>
            <div className="rod-body"></div>
            <div className="rod-end rod-end-right"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .medieval-actions {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 15;
}

.medieval-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 3px solid #8b7355;
  border-radius: 25px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.medieval-btn-edit {
  background: linear-gradient(135deg, #d4a574 0%, #b8956a 100%);
  color: #2c2c3e;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.medieval-btn-delete {
  background: linear-gradient(135deg, #8b0000 0%, #660000 100%);
  color: #f4e8d0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.medieval-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-confirmation {
  background: linear-gradient(135deg, #f4e8d0 0%, #ede0c8 100%);
  border: 4px solid #8b7355;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
        .scroll-container {
          position: relative;
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem 1rem;
          min-height: 100vh;
        }

        .wax-seal {
          position: absolute;
          top: -20px;
          right: 100px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #8b0000 0%, #660000 100%);
          border-radius: 50%;
          z-index: 10;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          animation: sealDrop 1s ease-out;
        }

        .seal-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #d4a574;
          font-size: 24px;
          font-weight: bold;
        }

        @keyframes sealDrop {
          0% { 
            transform: translateY(-100px) rotate(180deg); 
            opacity: 0; 
          }
          60% { 
            transform: translateY(10px) rotate(20deg); 
          }
          100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 1; 
          }
        }

        .ancient-scroll {
          position: relative;
          background: linear-gradient(
            135deg,
            #f4e8d0 0%,
            #ede0c8 20%,
            #e8dac4 40%,
            #f0e4d2 60%,
            #ede0c8 80%,
            #f4e8d0 100%
          );
          border-radius: 0;
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.3),
            inset 0 0 100px rgba(139, 131, 107, 0.1);
          transform-origin: center top;
          overflow: hidden;
        }

        .unfurling {
          animation: unfurlScroll 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scaleY(0.1);
        }

        .unfurled {
          transform: scaleY(1);
        }

        @keyframes unfurlScroll {
          0% { 
            transform: scaleY(0.05) rotateX(90deg); 
            opacity: 0.5;
          }
          30% { 
            transform: scaleY(0.3) rotateX(45deg); 
            opacity: 0.7;
          }
          60% { 
            transform: scaleY(0.7) rotateX(15deg); 
            opacity: 0.9;
          }
          100% { 
            transform: scaleY(1) rotateX(0deg); 
            opacity: 1;
          }
        }

        .scroll-shadow {
          position: absolute;
          top: 0;
          left: -20px;
          right: -20px;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(0,0,0,0.2) 0%,
            transparent 20%,
            transparent 80%,
            rgba(0,0,0,0.2) 100%
          );
          z-index: -1;
          filter: blur(10px);
        }

        .scroll-rod {
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 5;
        }

        .scroll-rod-top {
          margin-bottom: -5px;
        }

        .scroll-rod-bottom {
          margin-top: -5px;
        }

        .rod-body {
          flex: 1;
          height: 16px;
          background: linear-gradient(
            90deg,
            #8b4513 0%,
            #a0522d 20%,
            #cd853f 50%,
            #a0522d 80%,
            #8b4513 100%
          );
          border-radius: 8px;
          box-shadow: 
            inset 0 2px 4px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.2);
        }

        .rod-end {
          width: 24px;
          height: 20px;
          background: linear-gradient(135deg, #cd853f 0%, #8b4513 100%);
          border-radius: 50%;
          box-shadow: 
            inset 0 2px 4px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.2);
          position: relative;
        }

        .ribbon {
          position: absolute;
          top: -15px;
          font-size: 24px;
          color: #8b0000;
          animation: ribbonSway 3s ease-in-out infinite;
        }

        .ribbon-left {
          left: -30px;
        }

        .ribbon-right {
          right: -30px;
        }

        @keyframes ribbonSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .scroll-parchment {
          position: relative;
          padding: 3rem 2rem;
          background: 
            radial-gradient(circle at 20% 80%, rgba(160, 151, 130, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(160, 151, 130, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 131, 107, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #f4e8d0 0%, #ede0c8 100%);
          min-height: 500px;
          border-left: 3px solid rgba(139, 131, 107, 0.3);
          border-right: 3px solid rgba(139, 131, 107, 0.3);
        }

        .decorative-border-top,
        .decorative-border-bottom {
          text-align: center;
          color: #8b7355;
          font-size: 14px;
          margin: 1rem 0;
          font-family: 'Courier Prime', monospace;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .entry-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .illuminated-title {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c2c3e;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          line-height: 1.2;
        }

        .drop-cap {
          float: left;
          font-size: 4rem;
          line-height: 3rem;
          padding: 0 8px 0 0;
          margin: 0 8px 0 0;
          color: #8b0000;
          background: linear-gradient(135deg, #d4a574 0%, #b8956a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          border: 2px solid #8b7355;
          border-radius: 8px;
          text-align: center;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(212, 165, 116, 0.1);
        }

        .entry-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          color: #5a5a6e;
        }

        .meta-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .decorative-separator {
          text-align: center;
          color: #8b7355;
          margin: 2rem 0;
          font-size: 12px;
        }

        .scroll-content {
          max-width: 100%;
          margin: 0 auto;
        }

        .content-text {
          font-family: 'Courier Prime', monospace;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #2c2c3e;
          text-align: justify;
          text-indent: 2rem;
          white-space: pre-wrap;
        }

        .typewriter-text {
          position: relative;
        }

        .quill-cursor {
          opacity: 1;
          animation: blink 1.2s infinite;
          color: #8b0000;
          font-weight: bold;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Age marks and ink blots */
        .age-mark {
          position: absolute;
          color: rgba(139, 131, 107, 0.4);
          font-size: 8px;
        }

        .age-mark-1 {
          top: 15%;
          left: 10%;
        }

        .age-mark-2 {
          top: 60%;
          right: 15%;
        }

        .age-mark-3 {
          bottom: 20%;
          left: 20%;
        }

        .ink-blot {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(44, 44, 62, 0.2) 0%, transparent 70%);
        }

        .ink-blot-1 {
          width: 8px;
          height: 8px;
          top: 30%;
          right: 10%;
        }

        .ink-blot-2 {
          width: 5px;
          height: 5px;
          bottom: 40%;
          left: 8%;
        }

        .burn-mark {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 60%);
        }

        .burn-mark-1 {
          width: 12px;
          height: 8px;
          top: 10%;
          right: 5%;
          border-radius: 60% 40% 40% 60%;
        }

        .burn-mark-2 {
          width: 6px;
          height: 10px;
          bottom: 15%;
          left: 5%;
          border-radius: 40% 60% 60% 40%;
        }

        /* Loading and error states */
        .medieval-loading {
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: var(--castle-gold);
          padding: 4rem;
        }

        .medieval-error {
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          color: var(--flame-orange);
          padding: 4rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .scroll-container {
            padding: 1rem 0.5rem;
          }

          .scroll-parchment {
            padding: 2rem 1rem;
          }

          .illuminated-title {
            font-size: 2rem;
          }

          .drop-cap {
            font-size: 3rem;
            line-height: 2rem;
            width: 50px;
            height: 50px;
          }

          .wax-seal {
            right: 50px;
          }

          .entry-meta {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}