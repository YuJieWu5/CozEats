import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { themes } from './theme';

type ThemeType = 'light' | 'dark';
type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    themeOption: ThemeOption;
    setThemeOption: (option: ThemeOption) => void;
    activeTheme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: { 
  children: React.ReactNode;
  defaultTheme?: ThemeOption;
}) {
    const systemColorScheme = (useNativeColorScheme() as ThemeType) || 'light';
    const [themeOption, setThemeOption] = useState<ThemeOption>(defaultTheme);
    const [theme, setTheme] = useState<ThemeType>(
      defaultTheme === 'system' ? systemColorScheme : (defaultTheme as ThemeType)
    );
    const { setColorScheme } = useNativewindColorScheme();

    // Update theme when themeOption or system theme changes
    useEffect(() => {
        if (themeOption === 'system') {
            setTheme(systemColorScheme);
        } else {
            setTheme(themeOption as ThemeType);
        }
    }, [themeOption, systemColorScheme]);

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    const activeTheme = themes[theme];

    return (
        <ThemeContext.Provider value={{ theme, themeOption, setThemeOption, activeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}