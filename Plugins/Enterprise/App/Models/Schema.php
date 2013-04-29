<?php
/**
 * Copyright (C) 2013 Antoine Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace Enterprise;

/**
 * @Entity @Table(name="schemas_n")
 */
class Schema extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $name;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $creator;

    /**
     * @ManyToMany(targetEntity="\User")
     */
    private $participants;

    /**
     * @Column(type="string")
     */
    private $filename;

    /**
     * @OneToMany(targetEntity="\Enterprise\SchemaText", mappedBy="schema")
     */
    private $schema_texts;

    public function __construct()
    {
        $this->participants = new \Doctrine\Common\Collections\ArrayCollection();
        $this->creator = \User::current_user();
        $this->name = "new schema";
        $this->schema_texts = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function addParticipant($participant)
    {
        $this->participants[] = $participant;
    }

    public function removeParticipant($participant)
    {
        $this->participants->removeElement($participant);
    }

    public function getParticipants()
    {
        return $this->participants;
    }

    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

    public function getFilename()
    {
        return $this->filename;
    }

    public function addSchemaText($schema_text)
    {
        $this->schema_texts[] = $schema_text;
    }

    public function clearSchemaText()
    {
        $this->schema_texts->clear();
    }

    public function getSchemaTexts()
    {
        return $this->schema_texts;
    }

    public function toArray()
    {
        $participants = array();

        foreach ($this->participants as $p)
        {
            $participants[] = $p->getSessionId();
        }

        if (!file_exists(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename))
        {
            file_put_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename, "");
        }

        $texts_list = array();

        foreach ($this->schema_texts as $st)
        {
            $texts_list[] = $st->toArray();
        }

        $array = array();

        if (\User::current_user() != null)
        {
            $array = array(
                "id" => $this->id,
                "name" => $this->name,
                "participants" => is_object($this->participants) ? $this->participants->toArray() : array(),
                "sessions" => $participants,
                "data" => "data:image/png;base64," . urlencode(base64_encode(file_get_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename))),
                "contents" => file_get_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename),
                "texts" => $texts_list
            );
        }
        else
        {
            $array = array(
                "id" => $this->id,
                "name" => $this->name,
                "participants" => is_object($this->participants) ? $this->participants->toArray() : array(),
                "sessions" => $participants,
                "data" => base64_encode(file_get_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename)),
                "contents" => file_get_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $this->filename),
                "texts" => $texts_list
            );
        }

        return $array;
    }
}

