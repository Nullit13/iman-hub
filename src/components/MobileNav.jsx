import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { 
  FaHome, 
  FaBookOpen, 
  FaHands, 
  FaMosque, 
  FaCalendarAlt 
} from 'react-icons/fa';

const T = {
  bg:      "#0B1F14",
  border:  "rgba(212,168,67,0.15)",
  gold:    "#D4A843",
  muted:   "#4A6B58",
  text:    "#EEF4F0",
  surface: "#112A1C",
};

const Bar = styled.nav`
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 900;
  background: ${T.bg};
  border-top: 1px solid ${T.border};
  padding-bottom: env(safe-area-inset-bottom);
  backdrop-filter: blur(20px);

  @media (min-width: 821px) {
    display: none;
  }
`;

const TabRow = styled.ul`
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 62px;
`;

const Tab = styled.li`
  flex: 1;
`;

const TabLink = styled(NavLink)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  border-radius: 0;
  position: relative;
  transition: background 0.18s;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 2px;
    border-radius: 0 0 3px 3px;
    background: ${T.gold};
    opacity: 0;
    transition: opacity 0.2s;
  }

  &.active::before {
    opacity: 1;
  }

  &:hover {
    background: rgba(255,255,255,0.04);
  }
`;

const Icon = styled.span`
  font-size: 22px;
  line-height: 1;
  transition: transform 0.2s;
  color: ${T.muted};
  display: flex;
  align-items: center;
  justify-content: center;

  ${TabLink}.active & {
    color: ${T.gold};
    transform: scale(1.15);
  }
`;

const Label = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${T.muted};
  font-family: "Segoe UI", system-ui, sans-serif;
  transition: color 0.18s;

  ${TabLink}.active & {
    color: ${T.gold};
  }
`;

const TABS = [
  { to: "/",         label: "Home",     icon: <FaHome /> },
  { to: "/quran",    label: "Quran",    icon: <FaBookOpen /> },
  { to: "/athkar",   label: "Athkar",   icon: <FaHands /> },
  { to: "/salah",    label: "Salah",    icon: <FaMosque /> },
  { to: "/holidays", label: "Holidays", icon: <FaCalendarAlt /> },
];

export default function MobileNav() {
  return (
    <Bar>
      <TabRow>
        {TABS.map(t => (
          <Tab key={t.to}>
            <TabLink to={t.to} end={t.to === "/"}>
              <Icon>{t.icon}</Icon>
              <Label>{t.label}</Label>
            </TabLink>
          </Tab>
        ))}
      </TabRow>
    </Bar>
  );
}