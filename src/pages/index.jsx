import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { motion, useAnimation } from 'framer-motion';
import styles from './index.module.css';

const MotionHeading = motion(Heading);
const MotionP = motion.p;
const MotionLink = motion(Link);
const MotionDiv = motion.div;

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className={clsx("container", styles.heroContainer)}>
                <MotionHeading
                    as="h1"
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    {siteConfig.title}
                </MotionHeading>
                
                <MotionP
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                >
                    {siteConfig.tagline}
                </MotionP>
                
                <MotionDiv
                    className={styles.buttons}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                >
                    <MotionLink
                        className={clsx("button", styles.mainButton)}
                        to="/intro"
                        whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            boxShadow: '0 10px 25px rgba(179, 255, 0, 0.5)' 
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        COMENZAR AHORA
                    </MotionLink>
                </MotionDiv>
            </div>
        </header>
    );
}

function FeatureBox({ title, description, index, visible }) {
    // Diferentes animaciones basadas en la posición
    const animations = [
        { 
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
        },
        { 
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
        },
        { 
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 }
        }
    ];

    return (
        <div className={clsx('col col--4', styles.feature)}>
            <MotionDiv
                className={clsx(styles.featureBox, styles[`feature${index + 1}`])}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                variants={animations[index]}
                transition={{ 
                    duration: 0.8, 
                    ease: [0.23, 1, 0.32, 1],
                    delay: index * 0.2
                }}
                whileHover={{
                    y: -10,
                    rotateY: 5,
                    boxShadow: index % 2 === 0 
                        ? '0 15px 35px rgba(124, 187, 0, 0.2)'
                        : '0 15px 35px rgba(179, 255, 0, 0.2)'
                }}
            >
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                >
                    {title}
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                >
                    {description}
                </motion.p>
            </MotionDiv>
        </div>
    );
}

function HomepageFeatures() {
    const [visibleFeatures, setVisibleFeatures] = useState([false, false, false]);
    const controls = useAnimation();

    useEffect(() => {
        const checkVisibility = () => {
            const section = document.querySelector(`.${styles.features}`);
            if (!section) return;
            
            const position = section.getBoundingClientRect();
            if (position.top < window.innerHeight - 100) {
                setVisibleFeatures([true, true, true]);
                window.removeEventListener('scroll', checkVisibility);
            }
        };
        
        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
        
        return () => window.removeEventListener('scroll', checkVisibility);
    }, []);

    const features = [
        {
            title: 'SMART CONTRACTS',
            description: 'Desarrolla e implementa contratos inteligentes de alto nivel en la red Vara con nuestros hooks y template..'
        },
        {
            title: 'GVARA HOOKS',
            description: 'Gestiona wallets, transacciones y estados con nuestros hooks React personalizados para la red Vara.'
        },
        {
            title: 'AGILIZA TU APP',
            description: 'AGILIZA TU DESARROLLO DE DAPPS UTILIZANDO NUESTROS HOOKS PARA INTERACTUAR CON CONTRACTOS REALIDADOS CON SAILS'
        }
    ];

    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {features.map((feature, idx) => (
                        <FeatureBox
                            key={idx}
                            title={feature.title}
                            description={feature.description}
                            index={idx}
                            visible={visibleFeatures[idx]}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function HomepagePowered() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const checkVisibility = () => {
            const section = document.querySelector(`.${styles.powered}`);
            if (!section) return;
            
            const position = section.getBoundingClientRect();
            if (position.top < window.innerHeight - 100) {
                setIsVisible(true);
                window.removeEventListener('scroll', checkVisibility);
            }
        };
        
        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
        
        return () => window.removeEventListener('scroll', checkVisibility);
    }, []);

    return (
        <section className={styles.powered}>
            <div className="container">
                <MotionDiv
                    className={styles.poweredTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    POWERED BY WEB3.0
                </MotionDiv>
                
                <MotionP
                    className={styles.poweredSubtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                >
                    DESARROLLA DAPPS CON REACT.JS
                </MotionP>
                
                <MotionDiv 
                    className={styles.buttons}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                >
                    <MotionLink
                        className={clsx("button button--secondary button--lg", styles.secondaryButton)}
                        to="/hooks/useWalletManagement"
                        whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            boxShadow: '0 10px 25px rgba(179, 255, 0, 0.3)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        EXPLORAR DOCUMENTACIÓN
                    </MotionLink>
                </MotionDiv>
            </div>
        </section>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Documentación para el template VaraNetwork inspirada en Monogatari"
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
                <HomepagePowered />
            </main>
        </Layout>
    );
}