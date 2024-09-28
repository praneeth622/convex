'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useMutation } from 'convex/react'
import {api} from '../../../convex/_generated/api'

interface MemeObject {
  id: number
  x: number
  y: number
  width: number
  height: number
  text: string
}

interface MemeData {
  imageUrl: string
  objects: MemeObject[]
}

export default function Component() {
  const [imageUrl, setImageUrl] = useState('')
  const [memeObjects, setMemeObjects] = useState<MemeObject[]>([])
  const [storedMemes, setStoredMemes] = useState<MemeData[]>([])
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [resizingId, setResizingId] = useState<number | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const upload = useMutation(api.crud.UploadMeme)

  const addInputField = () => {
    const newObject: MemeObject = {
      id: Date.now(),
      x: 0,
      y: 0,
      width: 100,
      height: 30,
      text: ''
    }
    setMemeObjects([...memeObjects, newObject])
  }
  useEffect(()=>{
    const uploads =async()=>{
        const hellow = 'sfbhdkcjn'
    const result = await upload({body:hellow})
    if(result){
        console.log("Uploaded")
    }
    else{
        console.log("Not uploaded")
    }
    }
    uploads()

  },[])

  const updateInputField = (id: number, updates: Partial<MemeObject>) => {
    setMemeObjects(memeObjects.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ))
  }

  const handleMouseDown = (e: React.MouseEvent, id: number, action: 'drag' | 'resize') => {
    if (action === 'drag') {
      setDraggingId(id)
    } else {
      setResizingId(id)
    }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (imageRef.current && (draggingId !== null || resizingId !== null)) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMemeObjects(prevObjects => 
        prevObjects.map(obj => {
          if (obj.id === draggingId) {
            return { ...obj, x, y }
          } else if (obj.id === resizingId) {
            return { 
              ...obj, 
              width: Math.max(50, x - obj.x), 
              height: Math.max(20, y - obj.y) 
            }
          }
          return obj
        })
      )
    }
  }, [draggingId, resizingId])

  const handleMouseUp = () => {
    setDraggingId(null)
    setResizingId(null)
  }

  const storeMemeData = () => {
    const newMemeData: MemeData = {
      imageUrl,
      objects: memeObjects
    }
    setStoredMemes([...storedMemes, newMemeData])
    setImageUrl('')
    setMemeObjects([])
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full"
        />
      </div>

      {imageUrl && (
        <div 
          ref={imageRef}
          className="relative mb-4 border border-gray-300"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img src={imageUrl} alt="Meme" className="max-w-full h-auto" />
          {memeObjects.map((obj) => (
            <div
              key={obj.id}
              style={{
                position: 'absolute',
                left: obj.x,
                top: obj.y,
                width: obj.width,
                height: obj.height
              }}
            >
              <Input
                type="text"
                value={obj.text}
                onChange={(e) => updateInputField(obj.id, { text: e.target.value })}
                style={{ width: '100%', height: '100%' }}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div 
                className="absolute inset-0 cursor-move"
                onMouseDown={(e) => handleMouseDown(e, obj.id, 'drag')}
              />
              <div 
                className="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                onMouseDown={(e) => handleMouseDown(e, obj.id, 'resize')}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 space-x-2">
        <Button onClick={addInputField}>Add Input Field</Button>
        <Button onClick={storeMemeData}>Store Meme Data</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Stored Meme Data</h2>
        {storedMemes.map((meme, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Meme {index + 1}</h3>
              <p>Image URL: {meme.imageUrl}</p>
              <h4 className="font-semibold mt-2">Input Fields:</h4>
              <ul>
                {meme.objects.map((obj, objIndex) => (
                  <li key={objIndex}>
                    Field {objIndex + 1}: Position ({Math.round(obj.x)}, {Math.round(obj.y)}), 
                    Size ({Math.round(obj.width)}x{Math.round(obj.height)}), Text: {obj.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}