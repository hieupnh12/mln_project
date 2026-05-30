package com.sed10.mln.study.service;

import org.springframework.stereotype.Service;

import com.sed10.mln.study.dto.request.SubjectRequest;
import com.sed10.mln.study.dto.response.SubjectResponse;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.SubjectMapper;
import com.sed10.mln.study.repository.SubjectRepository;

import lombok.RequiredArgsConstructor;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectService {
    final SubjectRepository subjectRepo;
    final SubjectMapper subjectMap;
    
    public SubjectResponse createSubject(SubjectRequest request) {
        Subject subject = subjectMap.toSubject(request);
        subject = subjectRepo.save(subject);
        return subjectMap.toSubjectResponse(subject);
    }

    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        return subjectMap.toSubjectResponse(subject);
    }

    public List<SubjectResponse> getAllSubjects() {
       return subjectRepo.findAll().stream()
       .map(subjectMap::toSubjectResponse)
       .collect(Collectors.toList());
    }
    
    
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        subjectMap.updateSubjectFromRequest(request, subject);
        subject = subjectRepo.save(subject);
        return subjectMap.toSubjectResponse(subject);
    }

    public void deleteSubject(Long id) {
        Subject subject = subjectRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        subjectRepo.delete(subject);
    }

}
