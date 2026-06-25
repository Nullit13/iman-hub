import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { 
  FaHome, 
  FaBookOpen, 
  FaHands, 
  FaMosque, 
  FaCalendarAlt, 
  FaClock 
} from 'react-icons/fa';

const T = {
  bg:        "#0B1F14",
  bgGlass:   "rgba(11,31,20,0.82)",
  green:     "#1A7A50",
  greenGlow: "#22A86E",
  gold:      "#D4A843",
  goldLight: "#F0C870",
  surface:   "#112A1C",
  border:    "rgba(212,168,67,0.18)",
  text:      "#EEF4F0",
  muted:     "#7A9E8A",
  white:     "#FFFFFF",
};

const fadeDown = keyframes`
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:translateY(0); }
`;

const NavWrap = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  background: ${({ scrolled }) => scrolled ? T.bgGlass : "transparent"};
  backdrop-filter: ${({ scrolled }) => scrolled ? "blur(18px)" : "none"};
  border-bottom: ${({ scrolled }) => scrolled ? `1px solid ${T.border}` : "none"};
  transition: background 0.35s, backdrop-filter 0.35s, border 0.35s;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  user-select: none;
`;

const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const LogoName = styled.span`
  font-family: "Georgia", serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${T.text};
  em {
    font-style: normal;
    color: ${T.gold};
  }
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 820px) {
    display: none;
  }
`;

const linkBase = css`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${T.muted};
  text-decoration: none;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: ${T.text};
    background: rgba(255,255,255,0.06);
  }

  &.active {
    color: ${T.gold};
    background: rgba(212,168,67,0.1);
  }
`;

const StyledLink = styled(NavLink)`${linkBase}`;

const LinkIcon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const QuickBtn = styled(NavLink)`
  margin-left: 12px;
  padding: 9px 20px;
  background: linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%);
  color: #0B1F14;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 820px) {
    display: none;
  }
`;

const Burger = styled.button`
  display: none;
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.07);
  border: 1px solid ${T.border};
  border-radius: 11px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.12); }

  @media (max-width: 820px) {
    display: flex;
  }
`;

const BurgerLine = styled.span`
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: ${T.gold};
  transition: transform 0.25s, opacity 0.25s;

  &:nth-child(1) { transform: ${({ $open }) => $open ? "translateY(7px) rotate(45deg)" : "none"}; }
  &:nth-child(2) { opacity: ${({ $open }) => $open ? 0 : 1}; }
  &:nth-child(3) { transform: ${({ $open }) => $open ? "translateY(-7px) rotate(-45deg)" : "none"}; }
`;

const Drawer = styled.div`
  background: ${T.bg};
  border-top: 1px solid ${T.border};
  padding: 16px 20px 28px;
  display: ${({ $open }) => $open ? "flex" : "none"};
  flex-direction: column;
  gap: 4px;
  animation: ${fadeDown} 0.22s ease;

  @media (min-width: 821px) { display: none; }
`;

const DrawerLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 11px;
  color: ${T.muted};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.18s, background 0.18s;

  &:hover, &.active {
    color: ${T.gold};
    background: rgba(212,168,67,0.08);
  }
`;

const DrawerIcon = styled.span`
  font-size: 20px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DrawerCta = styled(NavLink)`
  margin-top: 12px;
  padding: 14px;
  background: linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%);
  color: #0B1F14;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LINKS = [
  { to: "/",        label: "Home",     icon: <FaHome /> },
  { to: "/quran",   label: "Quran",    icon: <FaBookOpen /> },
  { to: "/athkar",  label: "Athkar",   icon: <FaHands /> },
  { to: "/salah",   label: "Salah",    icon: <FaMosque /> },
  { to: "/holidays",label: "Holidays", icon: <FaCalendarAlt /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <NavWrap scrolled={scrolled}>
      <Inner>
        <Logo to="/">
          <LogoMark>
            <img width="40px" src="/logo1-no-background.png" alt="logo" />
          </LogoMark>
          <LogoName>Iman <em>Hub</em></LogoName>
        </Logo>

        <Links>
          {LINKS.map(l => (
            <StyledLink key={l.to} to={l.to} end={l.to === "/"}>
              <LinkIcon>{l.icon}</LinkIcon>
              {l.label}
            </StyledLink>
          ))}
        </Links>

        <QuickBtn to="/salah"><FaClock /> Prayer Times</QuickBtn>

        <Burger onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <BurgerLine $open={open} />
          <BurgerLine $open={open} />
          <BurgerLine $open={open} />
        </Burger>
      </Inner>

      <Drawer $open={open}>
        {LINKS.map(l => (
          <DrawerLink key={l.to} to={l.to} end={l.to === "/"}>
            <DrawerIcon>{l.icon}</DrawerIcon>
            {l.label}
          </DrawerLink>
        ))}
        <DrawerCta to="/salah"><FaClock /> Prayer Times</DrawerCta>
      </Drawer>
    </NavWrap>
  );
}