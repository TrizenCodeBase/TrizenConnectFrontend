// Enhanced session management with persistent login support

const storeInSession = (key, value, persistent = true) => {
    try {
        if (persistent) {
            // Store in localStorage for persistent login across browser sessions
            localStorage.setItem(key, value);
            // Also store in sessionStorage for immediate access
            sessionStorage.setItem(key, value);
        } else {
            // Only store in sessionStorage for current session
            sessionStorage.setItem(key, value);
        }
    } catch (error) {
        console.error('Error storing session data:', error);
    }
}

const lookInSession = (key) => {
    try {
        // First check sessionStorage for current session
        let value = sessionStorage.getItem(key);
        if (value) {
            return value;
        }
        
        // If not in sessionStorage, check localStorage for persistent data
        value = localStorage.getItem(key);
        if (value) {
            // If found in localStorage, also set in sessionStorage for this session
            sessionStorage.setItem(key, value);
            return value;
        }
        
        return null;
    } catch (error) {
        console.error('Error retrieving session data:', error);
        return null;
    }
}

const removeFromSession = (key) => {
    try {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing session data:', error);
    }
}

const logOutUser = () => {
    try {
        // Clear both sessionStorage and localStorage
        sessionStorage.clear();
        // Only remove user-related data from localStorage, keep other app data
        const userKeys = ['user', 'access_token', 'auth_time'];
        userKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Check if stored authentication is still valid
const isAuthValid = () => {
    try {
        const userStr = lookInSession("user");
        if (!userStr) return false;
        
        const user = JSON.parse(userStr);
        if (!user.access_token) return false;
        
        // Check if auth timestamp exists and is not too old (optional)
        const authTime = localStorage.getItem('auth_time');
        if (authTime) {
            const authTimestamp = parseInt(authTime);
            const currentTime = Date.now();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
            
            // If auth is older than 30 days, consider it expired
            if (currentTime - authTimestamp > thirtyDays) {
                console.log('Authentication expired (older than 30 days)');
                logOutUser();
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error checking auth validity:', error);
        return false;
    }
}

// Store authentication with timestamp
const storeAuthData = (userData, persistent = true) => {
    try {
        storeInSession("user", JSON.stringify(userData), persistent);
        if (persistent) {
            localStorage.setItem('auth_time', Date.now().toString());
        }
    } catch (error) {
        console.error('Error storing auth data:', error);
    }
}

export {
    storeInSession, 
    lookInSession, 
    removeFromSession, 
    logOutUser, 
    isAuthValid, 
    storeAuthData
}