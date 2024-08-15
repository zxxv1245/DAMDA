package back.shoppingMart.common.mail;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;


    private final TemplateEngine templateEngine;

    public void sendEmail(String toEmail, String title, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(title);
            helper.setFrom("gwpeter1000@gmail.com");

            // Thymeleaf context 설정
            Context context = new Context();
            context.setVariables(variables); // 모든 변수를 설정

            // 지정된 템플릿을 사용해 HTML 본문을 생성
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true); // true indicates HTML

            mailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new CustomException(ErrorType.UNABLE_TO_SEND_EMAIL);
        }
    }

}
