package org.example.imedbackend.repository;

import java.util.List;
import java.util.Optional;
import org.example.imedbackend.entity.InternshipDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InternshipDocumentRepository extends JpaRepository<InternshipDocument, Long> {
    @Query(value = "select d.* from internship_documents d join internship_applications a on a.id = d.application_id where d.type in ('AGREEMENT','REPORT','CERTIFICATE')", nativeQuery = true)
    List<InternshipDocument> findAllWithExistingApplication();

    @Query(value = "select d.* from internship_documents d join internship_applications a on a.id = d.application_id where d.id = :id and d.type in ('AGREEMENT','REPORT','CERTIFICATE')", nativeQuery = true)
    Optional<InternshipDocument> findByIdWithExistingApplication(Long id);

    boolean existsByApplication_Id(Long applicationId);

    boolean existsByApplication_IdAndIdNot(Long applicationId, Long id);
}
