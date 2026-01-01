import { useEffect } from 'react';

/**
 * Hook para cambiar el título de la página.
 * @param title El título que se mostrará en la pestaña del navegador.
 */
export default function usePageTitle(title: string) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | Temporizador Exponencial`;

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
}
