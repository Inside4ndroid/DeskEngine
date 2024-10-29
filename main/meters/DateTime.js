/*
 * Developed by Inside4ndroid Studios Ltd
 */
class DateTime {
    static getDateInfo() {
        const now = new Date();
        return now;
    }

    static getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    static getToday() {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const now = new Date();
        const dayIndex = now.getDay();
        return daysOfWeek[dayIndex];
    }

    static getTimezone() {
        const now = new Date();
        const timezoneOffsetInMinutes = now.getTimezoneOffset();
        const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetInMinutes / 60));
        const timezoneOffsetMinutes = Math.abs(timezoneOffsetInMinutes % 60);
        const timezoneSign = timezoneOffsetInMinutes >= 0 ? '-' : '+';
        const timezoneString = `GMT${timezoneSign}${String(timezoneOffsetHours).padStart(2, '0')}${String(timezoneOffsetMinutes).padStart(2, '0')}`;
        return timezoneString;
    }

    static getMonth() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const now = new Date();
        const monthIndex = now.getMonth();
        return months[monthIndex];
    }

    static getDayOfMonth() {
        const now = new Date();
        const dayOfMonth = now.getDate();
        return dayOfMonth;
    }

    static getYear() {
        const now = new Date();
        return now.getFullYear();
    }
}

module.exports = DateTime;