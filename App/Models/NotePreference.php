<?php

/**
 * @Entity @Table(name="notePreferences")
 */
class NotePreference extends Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="array")
     */
    private $notes;

    /**
     * @OneToOne(targetEntity="User", mappedBy="note_preference")
     */
    private $user;

    public function getId()
    {
        return $this->id;
    }

    public function deleteNotes()
    {
        $this->notes = array();
    }

    public function addNote($note)
    {
        $this->notes[] = $note;
    }

    public function getNotes()
    {
        return $this->notes;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }
}