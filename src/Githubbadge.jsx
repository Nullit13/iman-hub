import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const REPO = "Nullit13/iman-hub";
const REPO_URL = `https://github.com/${REPO}`;

const T = {
  bg:       "#0B1F14",
  surface:  "#112A1C",
  border:   "rgba(212,168,67,0.22)",
  gold:     "#D4A843",
  goldText: "#F0C870",
  text:     "#EEF4F0",
  muted:    "#7A9E8A",
};

const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.3); }
  50%      { box-shadow: 0 0 0 6px rgba(212,168,67,0); }
`;

const Wrap = styled.a`
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 800;
  display: flex;
  align-items: center;
  gap: 0;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid ${T.border};
  overflow: hidden;
  box-shadow: 0 4px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,168,67,0.08);
  transition: transform 0.22s, box-shadow 0.22s;
  animation: ${pulse} 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.25);
    animation: none;
  }

  @media (max-width: 820px) {
    bottom: 78px;
  }
`;

const GitHubSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${T.surface};
  color: ${T.text};
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

const GithubIcon = styled.svg`
  width: 17px;
  height: 17px;
  fill: ${T.text};
  flex-shrink: 0;
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${T.border};
`;

const StarSide = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 13px;
  background: ${T.bg};
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: ${T.goldText};
  white-space: nowrap;
`;

const StarIcon = styled.span`
  font-size: 14px;
  line-height: 1;
`;

const Count = styled.span`
  min-width: 20px;
  transition: opacity 0.3s;
  opacity: ${({ $ready }) => $ready ? 1 : 0};
`;

export default function GitHubBadge({ repo = REPO, repoUrl = REPO_URL }) {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/Nullit13/iman-hub`)
      .then(r => r.json())
      .then(d => {
        console.log(d)
        if (typeof d.stargazers_count === "number") {
          setStars(
            d.stargazers_count >= 1000
              ? `${(d.stargazers_count / 1000).toFixed(1)}k`
              : String(d.stargazers_count)
          );
        }
      })
      .catch(() => setStars("★"));
  }, [repo]);

  return (
    <Wrap href={repoUrl} target="_blank" rel="noopener noreferrer" aria-label="Star Iman Hub on GitHub">
      <GitHubSide>
        <GithubIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
        </GithubIcon>
        Star on GitHub
      </GitHubSide>

      <Divider />

      <StarSide>
        <StarIcon>⭐</StarIcon>
        <Count $ready={stars !== null}>{stars ?? "—"}</Count>
      </StarSide>
    </Wrap>
  );
}