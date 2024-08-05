package back.shoppingMart.common.mail;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;


    public void sendEmail(String toEmail, String title, String text) {
        SimpleMailMessage emailForm = createEmailForm(toEmail, title, text);
        try {
            mailSender.send(emailForm);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.debug("MailService.sendEmail exception occur toEmail: {}, title: {}, text: {}", toEmail, title, text, e);
            throw new CustomException(ErrorType.UNABLE_TO_SEND_EMAIL);
        }
    }

    private SimpleMailMessage createEmailForm(String toEmail, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);
        message.setFrom("gwpeter1000@gmail.com");
        return message;
    }
}
