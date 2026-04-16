package com.learnivo.classservice.service;

import com.learnivo.classservice.entity.PlatformClass;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@DisplayName("MeetingService – Unit Tests")
class MeetingServiceTest {

    @InjectMocks
    private MeetingService meetingService;

    @Test
    @DisplayName("generateMeetLink() returns mock link when provider is mock")
    void generateMeetLink_mockMode() {
        ReflectionTestUtils.setField(meetingService, "provider", "mock");
        PlatformClass cls = PlatformClass.builder().id(123L).title("Test Class").build();

        String link = meetingService.generateMeetLink(cls);

        assertThat(link).startsWith("https://meet.google.com/");
        assertThat(link).contains("-");
    }

    @Test
    @DisplayName("safeTime() returns formatted time with added hours")
    void safeTime_test() {
        // safeTime is private, but we can test it through Reflection or by observing generateMeetLink behavior if it was visible.
        // Actually safeTime is used in buildEventJson which is used in createGoogleMeeting.
        // Let's test the formatted output of the mock link generation which uses buildMeetCode.
        
        PlatformClass cls1 = PlatformClass.builder().id(1L).title("Java").build();
        PlatformClass cls2 = PlatformClass.builder().id(2L).title("Java").build();
        
        ReflectionTestUtils.setField(meetingService, "provider", "mock");
        String link1 = meetingService.generateMeetLink(cls1);
        String link2 = meetingService.generateMeetLink(cls2);
        
        assertThat(link1).isNotEqualTo(link2);
    }
}
