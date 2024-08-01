// import useDarkModeImpl from '@fisch0920/use-dark-mode'
import { useDarkMode as useDarkModeImpl } from 'usehooks-ts'



export function useDarkMode() {
  const { isDarkMode, toggle } = useDarkModeImpl({ defaultValue: false });

  return {
    isDarkMode: isDarkMode,
    toggleDarkMode: toggle
  }
}
