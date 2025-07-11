const NotFound = () => {
    return (
        <div className="flex items-center justify-center text-center h-screen">
            <div>
                <p className="text-base font-semibold text-teal-500">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
            </div>
        </div>
    )
}

export default NotFound
