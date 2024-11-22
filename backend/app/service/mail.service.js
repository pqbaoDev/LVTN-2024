const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Đọc file HTML và chèn dữ liệu động
 * @param {string} filePath - Đường dẫn đến tệp HTML
 * @param {Object} replacements - Các giá trị thay thế
 * @returns {string} - Nội dung HTML sau khi chèn dữ liệu
 */
const renderTemplate = (filePath, replacements) => {
    const template = fs.readFileSync(filePath, 'utf-8');
    return Object.keys(replacements).reduce((html, key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        return html.replace(regex, replacements[key]);
    }, template);
};

/**
 * Gửi email với nội dung từ template
 * @param {string} to - Email người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} templateName - Tên file template
 * @param {Object} data - Dữ liệu động để chèn vào template
 */
const sendMail = async (subject, templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '../../views', templateName);
        const htmlContent = renderTemplate(templatePath, data);

        const recipientEmail = "pqbao.media@gmail.com"; // Email cố định

        await transporter.sendMail({
            from: `"2002Store" <${process.env.EMAIL_USER}>`,
            to: recipientEmail, // Email người nhận luôn là pqbao.media@gmail.com
            subject,
            html: htmlContent,
        });

        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};


module.exports = sendMail;
